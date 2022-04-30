export const TILE_OFFSET_MAP:Record<number, { backgroundPosition:string }> = {
    0 : { backgroundPosition: "0px    -64px" }, // Default: Grass
    1 : { backgroundPosition: "-64px -128px" }, // Tree
    2 : { backgroundPosition: "-96px  -64px" }, // Tall grass
    3 : { backgroundPosition: "0px   -192px" }, // Path
    4 : { backgroundPosition: "-32px  -156px"}, // Sign

    5 : { backgroundPosition: "-64px  0px"},    // Roof-Corner-Left
    6 : { backgroundPosition: "-64px  -32px"},  // Building-Corner-Left
    7 : { backgroundPosition: "-96px  0px"},    // Roof-Middle
    8 : { backgroundPosition: "-96px  -32px"},  // Door
    9 : { backgroundPosition: "-128px -32px"},  // Building-Middle
    10: { backgroundPosition: "-156px  0px"},   // Roof-Corner-Right
    11: { backgroundPosition: "-156px  -32px"}, // Building-Corner-Right
};