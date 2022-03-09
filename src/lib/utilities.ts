const columnMenuItems = [
    { text: 'EditCol', target: '.e-headercontent', id: 'editcol' },
    { text: 'NewCol', target: '.e-headercontent', id: 'newcol' },
    { text: 'DelCol', target: '.e-headercontent', id: 'delcol' },
    { text: 'ChooseCol', target: '.e-headercontent', id: 'choosecol' },
    { text: 'FreezeCol', target: '.e-headercontent', id: 'freezecol', iconCss: 'c-custom' },
    { text: 'FilterCol', target: '.e-headercontent', id: 'filtercol', iconCss: 'c-custom' },
    { text: 'MultiSort', target: '.e-headercontent', id: 'multisort', iconCss: 'c-custom' },
  ];  
  
  const rowMenuItems = [
    { text: 'AddNext', target: '.e-content', id: 'addnext' },
    { text: 'AddChild', target: '.e-content', id: 'addchild' },
    { text: 'DelRow', target: '.e-content', id: 'delrow' },
    { text: 'EditRow', target: '.e-content', id: 'editrow' },   
    { text: 'MultiSelect', target: '.e-content', id: 'multiselect', iconCss: 'c-custom' },
    { text: 'CopyRows', target: '.e-content', id: 'copyrows' },
    { text: 'CutRows', target: '.e-content', id: 'cutrows' },
    { text: 'PasteNext', target: '.e-content', id: 'pastenext' },    
    { text: 'PasteChild', target: '.e-content', id: 'pastechild' },
  ];

  const changeStyleOfColumn = (formData: any, selectedColIndex: number) => {
    const { fontSize, fontColor, backgroundColor, textWrap } = formData;
    const headerCell = (document.getElementsByClassName('customize-headercell') as HTMLCollectionOf<HTMLElement>)[selectedColIndex]
    const wrapWord = textWrap ? 'word-break' : 'normal';
    headerCell.setAttribute(
      'style', `font-size: ${fontSize}px; color: ${fontColor}; background-color: ${backgroundColor}; font-size: ${wrapWord}`);
  }

  export { columnMenuItems, rowMenuItems, changeStyleOfColumn};