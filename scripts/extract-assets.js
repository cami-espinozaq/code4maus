const fsL = require('fs');
const fs = fsL.promises;
const path = require('path');
const globby = require('globby');
const request = require('request');

const bucketUrl = `https://${process.env.ASSET_BUCKET}` +
    `.s3.dualstack.${process.env.FUNCTIONS_AWS_REGION || process.env.AWS_REGION}.amazonaws.com`;

const mapAssets = (asset) => {
    if ('md5ext' in asset) {
        return asset.md5ext;
    }
    return `${asset.assetId}.${asset.dataFormat}`;
};

const extractAssetsFromProject = async (path) => {
    const project = JSON.parse(await fs.readFile(path, 'utf-8'));
    return project.targets.reduce((out, target) => {
        out = out.concat(target.costumes.map(mapAssets));
        return out.concat(target.sounds.map(mapAssets));
    }, []);
};

const getLibraryContent = async () => {
    const sprites = JSON.parse(
        await fs.readFile(path.resolve(__dirname, '../src/lib/libraries/sprites.json'), 'utf-8')
    );
    const spritesAssets = sprites.reduce(
        (out, sprite) => out
            .concat(sprite.json.sounds.map((s) => s.md5))
            .concat(sprite.json.costumes.map((c) => c.baseLayerMD5)),
        [],
    );

    const singles = await Promise.all([ 'backdrops', 'costumes', 'sounds' ].map(
        async (type) => JSON.parse(
            await fs.readFile(path.resolve(__dirname, `../src/lib/libraries/${type}.json`), 'utf-8')
        ).map((a) => a.md5),
    ));
    return spritesAssets.concat(
        singles.reduce((out, assets) => out.concat(assets), [])
    );
};

const main = async () => {
    const defaultPath = path.resolve(__dirname, '../src/lib/default-project/project.json');
    const eduProjects = await globby(
        'src/lib/edu/*/project.json',
        { cwd: path.resolve(__dirname, '..') }
    );
    const projectPaths = [ defaultPath ].concat(eduProjects);
    const assets = (await projectPaths.reduce((prom, projectPath) => prom.then(
        async (out) => out.concat(await extractAssetsFromProject(projectPath))
    ), Promise.resolve([])))
        .concat(await getLibraryContent());
    const uniqueAssets = [ ...new Set(assets) ];
    const outPath = path.resolve(__dirname, '../.cache/data/assets');
    let writtenFileCount = 0;
    let existingFileCount = 0;
    await Promise.all(uniqueAssets.map(async (asset) => {
        const writePath = path.join(outPath, asset);
        try {
            const exists = (await fs.stat(writePath)).isFile();
            if (exists) {
                existingFileCount++;
                return;
            }
        } catch (e) {} // eslint-disable-line no-empty

        return new Promise((resolve, reject) => {
            const req = request(`${bucketUrl}/data/assets/${asset}`);
            const write = fsL.createWriteStream(writePath);
            let aborted = false;
            const stopStream = (e) => {
                aborted = true;
                req.abort();
                write.end(() => {
                    fs.unlink(writePath).then(() => reject(e));
                });
            };
            req.on('error', stopStream)
                .on('response', (response) => {
                    if (response.statusCode !== 200) {
                        stopStream(new Error('Response status code indicates failure.'));
                    }
                })
                .pipe(write)
                .on('error', stopStream)
                .on('finish', () => !aborted && resolve());
        })
            .then(() => writtenFileCount++)
            .catch(() => console.warn('Asset not found:', asset));
    }));
    console.log(`Done. ${existingFileCount} existed. Written ${writtenFileCount} new files.`);
};

main().catch(console.error);
