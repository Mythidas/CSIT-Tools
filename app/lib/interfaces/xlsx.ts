interface XLSXFontStyle {
  sz?: string; // Font size (e.g., "24")
  bold?: boolean; 
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  outline?: boolean;
  shadow?: boolean;
}

interface XLSXFillStyle {
  patternType?: string; // "solid" etc.
  fgColor?: { 
      rgb: string;  // Hexadecimal color code
  }
}

interface XLSXStyle {
  font?: XLSXFontStyle;
  fill?: XLSXFillStyle;
}

interface XLSXCell {
  value: string;
  style: XLSXStyle;
}

type XLSXRow = XLSXCell[]; 

interface XLSXColumn {
  title: string;
  width: {
      wpx?: number; // Width in pixels
      wch?: number; // Width in characters
  }
} 

interface XLSXDataSet {
  columns: XLSXColumn[];
  data: XLSXRow[]; 
}