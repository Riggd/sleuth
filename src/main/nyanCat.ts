export const createNyanCat = () => {
    const scale = 5;
    const frame = figma.createFrame();
    frame.name = "Nyan Cat Vector";
    frame.fills = [];
    frame.clipsContent = false;

    const colors: { [key: string]: { r: number, g: number, b: number } } = {
        'R': { r: 1, g: 0, b: 0 }, // Red
        'O': { r: 1, g: 0.6, b: 0 }, // Orange
        'Y': { r: 1, g: 1, b: 0 }, // Yellow
        'G': { r: 0.2, g: 1, b: 0 }, // Green
        'B': { r: 0, g: 0.6, b: 1 }, // Blue
        'P': { r: 0.4, g: 0, b: 1 }, // Purple
        '#': { r: 0, g: 0, b: 0 }, // Black outline
        'g': { r: 0.6, g: 0.6, b: 0.6 }, // Grey cat
        'p': { r: 1, g: 0.6, b: 0.8 }, // Pink icing
        't': { r: 1, g: 0.8, b: 0.6 }, // Tan pastry
        'c': { r: 1, g: 0.2, b: 0.6 }, // Cheeks
        'W': { r: 1, g: 1, b: 1 }, // White
    };

    // 21 rows x 34 cols approx
    const art = [
        "...................#######........",
        "...................#ggggg#........",
        "...................#g#g#g#........",
        "...........########xg#g#g#........",
        "..........#tttttttt#g###g#........",
        "RRRRRRRRR#ttppppppppt#gggg#.......",
        "OOOOOOOOO#tppppppppppt#######.....",
        "YYYYYYYYY#tppppppppppt#ggggg#.....",
        "GGGGGGGGG#tppppppppppt#g#g#g#.....",
        "BBBBBBBBB#tppppppppppt#g#g#g#.....",
        "PPPPPPPPP#ttppppppppt#g###g#......",
        "..........#ttttttttt#ggggg#.......",
        "...........################.......",
        "...........#gg#....#g#.#g#........",
        "...........####....###.###........"
    ];

    let maxX = 0;
    let maxY = 0;

    art.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            if (colors[char]) {
                const rect = figma.createRectangle();
                rect.x = x * scale;
                rect.y = y * scale;
                rect.resize(scale, scale);
                rect.fills = [{ type: 'SOLID', color: colors[char] }];
                frame.appendChild(rect);
                maxX = Math.max(maxX, (x + 1) * scale);
                maxY = Math.max(maxY, (y + 1) * scale);
            }
        }
    });

    frame.resize(maxX, maxY);
    return frame;
};
