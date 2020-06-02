import { TEXTURE_SIZE } from '../Constants.js';
import { Player } from '../entities/Player.js';
import { Platform } from '../entities/Platform.js';

// Loads a 24-bit bitmap image from the map file
export function loadMapBmp(scene) {
    scene.load.binary({key: scene.mapName, url: 'assets/maps/' + scene.mapName + '.bmp', dataType: DataView})
}

function readMapData(dataView) {
    let map = {}

    map.width = dataView.getUint32(18, true);
    map.height = dataView.getUint32(22, true);

    // Fail loading if the file is not 24-bit bitmap
    let bitsPerPixel = dataView.getUint16(28, true);
    if (bitsPerPixel != 24) {
        console.log("error: not 24 bit");
        return false;
    }

    // Fail loading if the image is compressed
    let compression = dataView.getUint32(30, true);
    if (compression != 0) {
        console.log("error: compressed");
        return false;
    }

    map.pixels = [];

    // Begin at the address where the pixel data begins (usually 54 byte offset)
    let offset = dataView.getUint32(10, true);

    for (let row = 0; row < map.height; row++) {
        map.pixels.push([]);
        for (let column = 0; column < map.width; column++) {
            let blue = dataView.getUint8(offset, true);
            let green = dataView.getUint8(offset+1, true);
            let red = dataView.getUint8(offset+2, true);
            map.pixels[row].push([red, green, blue])
            
            // Move along 3 bytes
            offset += 3;
        }

        // Acount for the fact that each scan line is padded
        // with zeroes to the nearest 4 bytes
        offset += (3*map.width) % 4;
    }

    // Prevents maps from being drawn upside down
    // This is because the bitmap is read from the bottom left corner, going left
    // However phaser draws from the top left corner, going left
    map.pixels = map.pixels.reverse();

    return map;
}

function positionToPx(position) {
    return TEXTURE_SIZE/2 + position*TEXTURE_SIZE
}

export function loadMap(scene, mapKey) {
    let mapDataView = scene.cache.binary.get(mapKey);
    let map = readMapData(mapDataView);
    scene.add.tileSprite(0, 0, 2*map.width*TEXTURE_SIZE, 2*map.height*TEXTURE_SIZE, 'Background');

    let i = 0;
    while (i < map.height) {
        let j = 0;
        while (j < map.width) {
            if (JSON.stringify(map.pixels[i][j]) == JSON.stringify([0,0,0])) {
                scene.platforms.add(new Platform(scene, positionToPx(j), positionToPx(i)));
            } else if (JSON.stringify(map.pixels[i][j]) == JSON.stringify([255,0,0])) {
                scene.player = new Player(scene, positionToPx(j), positionToPx(i));
            }

            j += 1;
        }
        
        i += 1;
    }
    
    return [map.width, map.height];
}