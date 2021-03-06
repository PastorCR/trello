import React from 'react';
import { render } from 'react-dom';
import './boardView.scss';

import Header from '../header/header.jsx';
import Board from './board.jsx';

import { updateUserBoards } from '../../actions/userActions.js';
import { getLists, addList } from '../../actions/listActions.js';
import { getBoard } from '../../actions/boardActions.js';
import { getCards } from '../../actions/cardActions.js';

import { connect } from 'react-redux';



class BoardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onAddList = this.onAddList.bind(this);
  }
  onChange(e) { this.setState({ [e.target.name]: e.target.value }) }

  onAddList() {
    const { addList, board } = this.props;
    if (this.state.listName) {
      addList(this.state.listName, board._id)
        .then(response => {
          this.setState({ listName: '' });
        })
    }
  }

  componentDidMount() {
    const queryString = require('query-string');
    const parsed = queryString.parse(location.search);
    const { getLists, getBoard, getCards, listsIds } = this.props;
    getBoard(parsed.id);
    getLists(parsed.id)
      .then(res => {
        const x = this.props.listIds;
        getCards(x)
      }
      );

  }

  render() {
    const { listName } = this.state;
    const { onAddList, onChange } = this;
    const { list, board, cards } = this.props;
    return (
      <div className="container-fluid">
        <Header title="Boards" user={this.props.user} />
        <main>
          <div className="row">
            <div className="col-md-12">
              <Board listName={listName} onChange={onChange} onAdd={onAddList} board={board} list={list} cards={cards} />
            </div>
          </div>
        </main>
      </div>
    );

  }
}
function mapStateToProps(state) {
  return {
    user: state.user.user,
    boards: state.board.boards,
    board: state.board.currentBoard,
    list: state.lists.lists,
    listIds: state.lists.listsIds,
    cards: state.cards.cards

  };
}

export default connect(mapStateToProps, { getLists, getBoard, addList, getCards })(BoardView);