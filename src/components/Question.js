import React from 'react'
import { connect } from 'react-redux';
import { loadQuestion, recordAnswer } from './../redux/actions/actions'

var mapStateToProps = (state) => {
    return {
        question: state.tasks.question
    }
}

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
    if(question.done){
      window.location = `/task/${this.props.match.params.id}`
    }
    var presenter = question.presenter
    if(presenter){
      presenter = presenter.split('|newline|').join('\n')
    };
    window.bossa = {};
    window.bossa.question = question.content;
    window.bossa.recordAnswerAndRefresh = function(answer){
      this.props.recordAnswer(question.id, answer);
    }.bind(this);
    return (
      <div>
        <div id='presenter' dangerouslySetInnerHTML={{ __html: presenter }}></div>
      </div>
    )
  }
}

export default connect(mapStateToProps, { loadQuestion, recordAnswer })(Question);
