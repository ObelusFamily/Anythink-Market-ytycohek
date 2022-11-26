import ItemList from "../ItemList";
import React from "react";
import agent from "../../agent";
import { connect } from "react-redux";
import { CHANGE_TAB } from "../../constants/actionTypes";

const YourFeedTab = (props) => {
  if (props.token) {
    const clickHandler = (ev) => {
      ev.preventDefault();
      props.onTabClick("feed", agent.Items.feed, agent.Items.feed());
    };

    return (
      <li className="nav-item">
        <button
          type="button"
          className={props.tab === "feed" ? "nav-link active" : "nav-link"}
          onClick={clickHandler}
        >
          Your Feed
        </button>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = (props) => {
  const clickHandler = (ev) => {
    ev.preventDefault();
    props.onTabClick("all", agent.Items.all, agent.Items.all());
  };
  return (
    <li className="nav-item">
      <button
        type="button"
        className={props.tab === "all" ? "nav-link active" : "nav-link"}
        onClick={clickHandler}
      >
        Global Feed
      </button>
    </li>
  );
};

const TagFilterTab = (props) => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <button type="button" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </button>
    </li>
  );
};

const mapStateToProps = (state) => ({
  ...state.itemList,
  tags: state.home.tags,
  searchInput: state.home.searchInput,
  token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({
  onTabClick: (tab, pager, payload) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload }),
});

const MainView = (props) => {
  const items =
    props.searchInput?.length > 0
      ? props.items.filter(({ title }) =>
          title.toLowerCase().includes(props.searchInput)
        )
      : props.items;
  const itemsCount = items?.length;

  const customNotFoundTextBox = (
    <div
      className="jumbotron"
      style={{
        backgroundColor: "#662d85",
        opacity: "0.8",
        textAlign: "center",
        width: "35rem",
        marginTop: "1rem",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <i class="bi bi-emoji-frown" style={{ fontSize: "3rem" }}></i>
      <p>
        No items found for "<strong>{props.searchInput}</strong>".
      </p>
    </div>
  );

  if (itemsCount === 0) {
    return customNotFoundTextBox;
  }

  return (
    <div>
      <div className="feed-toggle">
        <ul className="nav nav-tabs">
          <YourFeedTab
            token={props.token}
            tab={props.tab}
            onTabClick={props.onTabClick}
          />

          <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} />

          <TagFilterTab tag={props.tag} />
        </ul>
      </div>

      <ItemList
        pager={props.pager}
        items={items}
        loading={props.loading}
        itemsCount={itemsCount}
        currentPage={props.currentPage}
        customNotFound={customNotFoundTextBox}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
