import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { connect } from 'react-redux';

import './App.css';
import { Card, Modal, Button } from 'antd';
import { ReadOutlined, LikeOutlined, LikeTwoTone } from '@ant-design/icons';
import Nav from './Nav'
import API_KEYS from './API_keys';

const { Meta } = Card;

function ScreenArticlesBySource(props) {

  const [articleList, setArticleList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState([]); //modal visibility
  const [isModalLoading, setIsModalLoading] = useState(false);

  const { id } = useParams();

  //FETCH ARTICLES DATA FROM API

  useEffect(() => {
    async function fetchData() {
      let response = await fetch(`https://newsapi.org/v2/top-headlines?apiKey=${API_KEYS.newsAPI}&sources=${id}`);
      let jsonResponse = await response.json();
      setArticleList(jsonResponse.articles);
      setIsModalVisible(jsonResponse.articles.map(article => false));
    }
    fetchData();
  }, [id]);

  // MODAL SETUP FOR ARTICLE PREVIEW

  const showModal = (index) => {
    let newArr = [...isModalVisible];
    newArr[index] = true;
    setIsModalVisible(newArr);
  };

  const handleOk = (index) => {

    setIsModalLoading(true);

    let newArr = [...isModalVisible];
    newArr[index] = false;
    setTimeout(() => {
      setIsModalVisible(newArr);
      setIsModalLoading(false);
    }, 3000);

  };

  const handleCancel = (index) => {
    let newArr = [...isModalVisible];
    newArr[index] = false;
    setIsModalVisible(newArr);
  };


  // POPULATE CARDS WITH DATA FETCHED FROM API

  let cardsList = articleList.map((article, i) => {

    console.log(article.urlToImage);

    //set like button style depending if article is already in wishlist or not 

    let likeButton = <LikeOutlined type="like" key="ellipsis" onClick={() => props.addToWishList(article)} />;

    if (props.wishList.find(elem => elem.title === article.title)) {
      likeButton = <LikeTwoTone type="like" key="ellipsis" onClick={() => props.removeFromWishList(article)} />;
    }

    // set default cover pic value in case no cover is available in newsapi
    let cover = <img
      alt=""
      src={article.urlToImage}
    />

    if (article.urlToImage === 'null') {
      cover = <img
        alt=""
        src='/images/default.jpeg'
        style={{ height: '180px' }}
      />
    }

    return <Card
      key={i}
      style={{
        width: 300,
        margin: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      cover={
        cover
      }
      actions={[
        <ReadOutlined key="ellipsis2" onClick={() => showModal(i)} />,
        likeButton
      ]}
    >

      <Meta
        title={article.title}
        description={article.description}
      />

      <Modal title={article.title} visible={isModalVisible[i]} onOk={() => handleOk(i)}
        onCancel={() => handleCancel(i)}
        footer={[
          <Button key="back" onClick={() => handleCancel(i)}>
            Return
          </Button>,
          <Button
            key="link"
            href={article.url}
            target="_blank"
            type="primary"
            onClick={() => handleOk(i)}
            loading={isModalLoading}
          >
            Go to article
          </Button>,
        ]}>
        {article.content}
      </Modal>

    </Card>;
  });

  return (
    <div>

      <Nav />
      <div className="Banner" />

      <div className="Card">
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cardsList}
        </div>
      </div>

    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function (article) {
      dispatch({ type: 'addArticle', article })
    },
    removeFromWishList: function (article) {
      dispatch({ type: 'removeArticle', article })
    }
  }
}

function mapStateToProps(state) {
  return { wishList: state.wishList }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenArticlesBySource);
