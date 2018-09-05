import React from 'react'
import { connect } from 'react-redux';
import { loadQuestion, recordAnswer } from './../redux/actions/actions'

var mapStateToProps = (state) => {
    return {
        question: state.tasks.question
    }
}

/* for testing purposes only:
const question2 = {
  image: 'html://www.linktoimage.com',
  options: '["red", "yellow", "blue"]',
  doSomething: function(){
    console.log('wow it worked!');
  }
}
const htmlToRender = '<!DOCTYPE html>\n<html>\n<head>\n<style>\nh1 {color:red;}\np {color:blue;}\n</style>\n</head>\n<body>\n<p>My Task Presenter</p>\n<div id=\'one\'></div>\n<script>\nif(window.bossa.question){var question = window.bossa.question;\nconsole.log("one")\ndocument.getElementById("one").innerHTML = JSON.parse(question.options)[1];}\n</script>\n</body>\n</html>'
*/

class Question extends React.Component {
  componentWillMount() {
    this.props.loadQuestion(this.props.match.params.id)
  }

  componentDidMount(){
    this.enableScripts()
  }

  componentDidUpdate(){
    this.enableScripts()
  }

  enableScripts(){
    // since <script> elements are not executable when inserted via innerHTML,
    // this function's purpose is to replace those elements with executable copies
    function nodeScriptReplace(node) {
      function nodeScriptClone(node){
        var script  = document.createElement("script");
        script.text = node.innerHTML;
        for( var i = node.attributes.length-1; i >= 0; i-- ) {
          script.setAttribute( node.attributes[i].name, node.attributes[i].value );
        }
        return script;
      }

      if ( node.tagName === 'SCRIPT' ) {
        node.parentNode.replaceChild( nodeScriptClone(node) , node );
      }
      else {
        var i = 0;
        var children = node.childNodes;
        while ( i < children.length ) {
          nodeScriptReplace( children[i++] );
        }
      }
      return node;
    }

    nodeScriptReplace(document.getElementById('presenter'))
  }

  render(){
    var question = this.props.question
    var presenter = question.presenter
    if(presenter){
      presenter = presenter.split('\\n').join('\n')
    };
    window.bossa = {};
    window.bossa.question = question.content;
    window.bossa.recordAnswerAndRefresh = function(answer){
      this.props.recordAnswer(question.id, answer)
      this.props.loadQuestion(this.props.match.params.id)
      window.location.reload()
    }.bind(this);
    return (
      <div>
        <div>Task presenter is below:</div>
        <div id='presenter' dangerouslySetInnerHTML={{ __html: presenter }}></div>
        <div>Task presenter is above ^.</div>
      </div>
    )
  }
}

export default connect(mapStateToProps, { loadQuestion, recordAnswer })(Question);
