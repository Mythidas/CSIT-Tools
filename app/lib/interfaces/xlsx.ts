interface XLSXFontStyle {
  sz?: string; // Font size (e.g., "24")
  bold?: boolean; 
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  outline?: boolean;
  shadow?: boolean;
  name?: string; // Font name 
  color?: { rgb: string }; // Font color
}

interface XLSXFillStyle {
  patternType?: "solid" | "none";  
  fgColor?: { rgb: string };  
  bgColor?: { rgb: string }; 
}

interface XLSXBorderSide {
  style?: "thin" | "medium" | "thick" | "dotted" | "dashed";
  color?: { rgb: string };
}

interface XLSXBorderStyle {
  top?: XLSXBorderSide;
  bottom?: XLSXBorderSide;
  left?: XLSXBorderSide;
  right?: XLSXBorderSide;
  diagonal?: XLSXBorderSide;
  diagonalUp?: boolean;
  diagonalDown?: boolean;
}

interface XLSXStyle {
  font?: XLSXFontStyle;
  fill?: XLSXFillStyle;
  numFmt?: string | number;
  alignment?: {
    vertical?: "bottom" | "center" | "top";
    horizontal?: "bottom" | "center" | "top";
    wrapText?: boolean;
    readingOrder?: number; 
    textRotation?: number; 
  };
  border?: XLSXBorderStyle;
}

interface XLSXCell {
  value: string;
  style: XLSXStyle;
}

type XLSXRow = XLSXCell[]; 

interface XLSXColumn {
  title: string;
  width?: {
      wpx?: number; // Width in pixels
      wch?: number; // Width in characters
  }
  style?: XLSXStyle;
} 

interface XLSXDataSet {
  columns: XLSXColumn[];
  data: XLSXRow[]; 
}