// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { List, Row, Col, Typography, Input, Button } from 'antd';
import BraftEditor from 'braft-editor';
// import routes from '../constants/routes';
import RegularProcess from '../utils/RegularProcess';
import styles from './Home.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'braft-editor/dist/index.css';
// import { CopyToClipboard } from "react-copy-to-clipboard";

const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  constructor() {
    super();
    ipcRenderer.on('fileData', (event, arg) => {
      // let template = '<p>' + arg.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "</p><p>") + '</p>';
      // let template = '<p>' + arg.replace(/\n/g, '</p><p>') + '</p>';
      const template = arg
        .split('\n')
        .map(e => `<p>${e}</p>`)
        .join('');
      // arg.split('\n').map(e => '<p>' + e + '</p>').join("");
      this.setState({
        article: BraftEditor.createEditorState(template)
      });
      // console.log(arg) // prints "pong"
    });
  }

  state = {
    // editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
    // outputHTML: '',
    article: '',
    footnote: '',
    footnoteList: [],
    output: ''
  };

  uploadArticleFile = () => {
    const options = {
      title: '打开正文文件'
      // defaultPath: '/path/to/something/',
      // buttonLabel: 'Do it',
      /* filters: [
        { name: 'xml', extensions: ['xml'] }
      ], */
      // properties: ['showHiddenFiles'],
      // message: 'This message will only be shown on macOS'
    };

    dialog.showOpenDialog(null, options, filePaths => {
      if (filePaths) {
        ipcRenderer.send('readFile', filePaths[0]);
      }
      // filePaths && ipcRenderer.send('readFile', filePaths[0]);
      // console.log(filePaths);
      // event.sender.send('open-dialog-paths-selected', filePaths)
    });
    // this.setState({
    //   editorState: ContentUtils.insertText(this.state.editorState, '你好啊！')
    // });
  };

  uploadFootnoteFile = () => {
    // this.setState({
    //   editorState: ContentUtils.insertText(this.state.editorState, '你好啊！')
    // });
  };

  handleArticleChange = article => {
    this.setState({
      article: article.toText()
    });
  };

  handleFootnotehange = e => {
    const that = this;
    const { article } = this.state;
    const footnoteData = RegularProcess.getFootnoteData(e.toText());
    // console.log(data)
    return footnoteData
      .then(footnoteInfo => {
        console.log(footnoteInfo);
        that.setState({
          footnoteList: footnoteInfo
        });
        return RegularProcess.getOutputData(article, footnoteInfo);
      })
      .then(outputData => {
        console.log('==============');
        console.log(outputData);
        that.setState({
          output: outputData,
          editorState: BraftEditor.createEditorState(outputData)
        });
        return outputData;
      });
    // this.setState({
    //   editorState: e,
    //   outputHTML: e.toText()
    // });
    // console.log(e.target.value);
  };

  render() {
    const controls = ['undo', 'redo'];

    const { TextArea } = Input;

    const { output, footnote, footnoteList, article } = this.state;
    const articleExtendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '直接粘贴正文',
        onClick: this.uploadArticleFile
      },
      {
        key: 'custom-button2',
        type: 'button',
        text: '上传正文文件',
        onClick: this.uploadArticleFile
      }
    ];

    const footnoteExtendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '直接粘贴脚注',
        onClick: this.uploadFootnoteFile
      },
      {
        key: 'custom-button2',
        type: 'button',
        text: '上传脚注文件',
        onClick: this.uploadFootnoteFile
      }
    ];

    return (
      <div>
        <Row>
          <Col span={12}>
            <div className={styles.dataa}>
              <h2>正文</h2>
              <BraftEditor
                controls={controls}
                value={article}
                onChange={this.handleArticleChange}
                extendControls={articleExtendControls}
                contentStyle={{ height: 200 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.dataa}>
              <h2>脚注</h2>
              <BraftEditor
                controls={controls}
                value={footnote}
                onChange={this.handleFootnotehange}
                extendControls={footnoteExtendControls}
                contentStyle={{ height: 200 }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div className={styles.dataa}>
              <h2>脚注列表</h2>
              <div className={styles.datab}>
                <List
                  size="small"
                  // header={<h2>脚注列表</h2>}
                  // footer={<div>Footer</div>}
                  bordered
                  dataSource={footnoteList}
                  // pagination={{
                  //   onChange: page => {
                  //     console.log(page);
                  //   },
                  //   pageSize: 3
                  // }}
                  renderItem={item => (
                    <List.Item>
                      <Typography.Text mark>[{item.num}]</Typography.Text>{' '}
                      {item.text}
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.dataa}>
              <h2>输出</h2>
              <TextArea
                rows={4}
                value={output}
                autosize={{ minRows: 10, maxRows: 10 }}
              />
              {/* <BraftEditor
                controls={controls}
                value={editorState}
                contentStyle={{ height: 200 }}
              /> */}
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <div className={styles.dataa}>
              <Button type="primary" block>
                敬请期待
              </Button>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className={styles.dataa}>
              <Button type="primary" block>
                敬请期待
              </Button>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className={styles.dataa}>
              <Button type="primary" block>
                敬请期待
              </Button>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className={styles.dataa}>
              <Button type="primary" block>
                敬请期待
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
