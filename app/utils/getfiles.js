// const fs = require('fs-extra');
// const path = require('path');
const XRegExp = require('xregexp');

const footnoteRegex = XRegExp(/(?<num>\*\*.{1,3}\*\*)(?<text>.*)/);

async function getFootnoteData(footnoteData) {
  // 获取脚注内容并处理
  console.log(footnoteData);
  const footnoteInfo = [];
  // eslint-disable-next-line func-names
  // eslint-disable-next-line no-unused-vars
  XRegExp.forEach(footnoteData, /(\*\*)(.{1,3})(\*\*)(.*)/, (match, i) => {
    const dataProcess = XRegExp.exec(match[0], footnoteRegex);
    // console.log(dataProcess.groups.num)
    // console.log(dataProcess.groups.text)
    const info = {
      num: dataProcess.groups.num,
      text: dataProcess.groups.text
    };
    footnoteInfo.push(info);
  });

  // console.log(footnoteData)
  return footnoteInfo;
}

async function getOutputData(articleData, footnoteData) {
  let text = articleData;
  for (let index = 0; index < footnoteData.length; index += 1) {
    const element = footnoteData[index];
    // 如果能在文章中找到脚注，则替换该脚注
    if (text.indexOf(element.num) !== -1) {
      // 格式化为脚注格式，并且去掉空格 回车 换行等不合法的字符串
      const formatText = `[${element.text.trim()}](^)`;
      text = text.replace(element.num, formatText);
    }
  }
  // console.log(text)
  return text;
}

module.exports = {
  getFootnoteData,
  getOutputData
};
