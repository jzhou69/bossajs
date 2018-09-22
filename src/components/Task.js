import React from 'react'
import { connect } from 'react-redux';
import { loadTask, updateTask, publishTask, addQuestions, exportAnswers, createRedundancyTask } from './../redux/actions/actions'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

var mapStateToProps = (state) => {
  return {
    answer: state.tasks.answer,
    task: state.tasks.task,
    user: state.common.user
  }
}

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presenterValue: undefined,
      questionsValue: undefined
    };
  }

  componentWillMount() {
    this.props.loadTask(this.props.match.params.id)
  }

  componentWillReceiveProps(props){
    if(props.task.presenter){
      this.setState({presenterValue: props.task.presenter.split('|newline|').join('\n')})
    }
    if(props.answer){
      document.getElementById('export').innerHTML = props.answer.split('\n').join('<br>');
    }
  }

  renderCompleted(){
    return (
      <div>
        <button>QA some questions</button>
        <button onClick={() => this.props.exportAnswers(this.props.task.id)}>Export results</button>
        <button onClick={() => this.props.createRedundancyTask(this.props.task.id)}>Create redundancy QA task</button>
        <div id="export"></div>
      </div>
    )
  }

  renderIncompleted(){
    var task = this.props.task
    return (
      <div>
        <a href={`/task/${task.id}/question`}>Start contributing</a>
      </div>
    )
  }

  renderUnpublished(){
    var task = this.props.task
    return (
      <div>
        <h3>{task.name}</h3>
        <div style={{fontStyle: 'italic'}}>{task.completion && task.completion.split('/')[1]} questions uploaded</div>
        {this.renderSettings(true)}
        <button onClick={() => {
          this.props.publishTask(task.id);
        }}>Publish</button>
      </div>
    )
  }

  renderSettings(editable){
    var task = this.props.task
    return (
      <div>
        <div>Task Presenter</div>
        <CodeMirror
          value={this.state.presenterValue}
          options={{
            mode: 'xml',
            theme: 'material',
            lineNumbers: true
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({presenterValue: value});
          }}
        />
        {
          editable &&
          <div><button onClick={() => {
            // hacky I know
            // note that this doesn't split escaped newlines which is good
            this.props.updateTask(task.id, this.state.presenterValue.split('\n').join('|newline|'));
          }}>Save</button>
          <div>Redundancy</div>
          <input id='redundancy' defaultValue={task.redundancy}></input>
          <button onClick={() => {
            this.props.updateTask(task.id, undefined, document.getElementById('redundancy').value);
          }}>Save</button>
          <div>Import Questions; Note all fields must be strings</div>
          <CodeMirror
            value={this.state.questionsValue}
            options={{
              mode: 'xml',
              theme: 'material',
              lineNumbers: true
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({questionsValue: value});
            }}
          />
          <button onClick={() => {
            var questionsUnprocessed = this.state.questionsValue.split('\n');
            var header = questionsUnprocessed[0].split('|');
            var questionsProcessed = []
            for(let i=1; i < questionsUnprocessed.length; i++){
              let questionString = questionsUnprocessed[i].split('|')
              if(questionString.length != header.length){
                continue;
              }
              let question = {};
              for(let j=0; j < header.length; j++){
                question[header[j]] = questionString[j];
              }
              questionsProcessed.push(question)
            }
            this.props.addQuestions(task.id, questionsProcessed);
          }}>Import</button></div>
        }
      </div>
    )
  }

  render(){
    var task = this.props.task
    if(task.isPublished){
      return (
        <div>
          <h3>{task.name}</h3>
          <div style={{fontStyle: 'italic'}}>{task.completion} questions completed</div>
          {
            task.completed ? this.renderCompleted() : this.renderIncompleted()
          }
          {this.props.user.id == this.props.task.userId ? this.renderSettings(!task.completed) : null}
        </div>
      )
    } else {
      return (
        <div>
          {this.renderUnpublished()}
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, { loadTask, updateTask, publishTask, addQuestions, exportAnswers, createRedundancyTask })(Task);
