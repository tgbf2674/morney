
function setName(tag: Tag) {
  if (tag.name.toString().indexOf('吃') >= 0) {
    return 'dinner';
  } else if (tag.name.toString().indexOf('服饰') >= 0) {
    return 'clothe';
  } else if (tag.name.toString().indexOf('交通') >= 0) {
    return 'traffic';
  } else if (tag.name.toString().indexOf('日用') >= 0) {
    return 'necessary';
  } else if (tag.name.toString().indexOf('房租') >= 0) {
    return 'house';
  } else if (tag.name.toString().indexOf('水电') >= 0) {
    return 'hydropower';
  } else if (tag.name.toString().indexOf('娱乐') >= 0) {
    return 'entertainment';
  } else if (tag.name.toString().indexOf('社交') >= 0) {
    return 'social';
  } else if (tag.name.toString().indexOf('编辑') >= 0) {
    return 'edit';
  } else if (tag.name.toString().indexOf('工资') >= 0) {
    return 'income';
  } else {
    return 'customize';
  }
}

export {setName};
