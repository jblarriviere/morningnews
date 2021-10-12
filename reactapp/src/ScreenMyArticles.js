import React, { useState } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Card, Empty, Modal, Button } from 'antd';
import { ReadOutlined, DeleteOutlined } from '@ant-design/icons';
import Nav from './Nav'

const { Meta } = Card;

function ScreenMyArticles(props) {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalUrl, setModalUrl] = useState('');

  const showModal = (article) => {
    setIsModalVisible(true);
    setModalTitle(article.title);
    setModalContent(article.content);
    setModalUrl(article.url);
  };

  const handleDelete = async (article) => {
    props.deleteFromWishList(article);

    console.log(props.token);
    console.log(article.title);

    await fetch(`/wishlist/article?token=${props.token}&title=${article.title}`, {
      method: 'DELETE',
    });
  }

  const handleOk = () => {

    setIsModalLoading(true);

    setTimeout(() => {
      setIsModalVisible(false);
      setIsModalLoading(false);
    }, 3000);

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  let articleList = props.wishList.map((article, i) => {

    // style read button in green if it has not been read yet

    let readStyle = {};
    if (!article.read) {
      readStyle.color = '#52c41a';
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

    return (
      <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
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
            <ReadOutlined key="ellipsis2" style={readStyle} onClick={() => { showModal(article); props.readArticleInWishlist(article) }} />,
            <DeleteOutlined key="ellipsis" onClick={() => handleDelete(article)} />
          ]}
        >
          <Meta
            title={article.title}
            description={article.description}
          />
        </Card>
      </div>
    )
  });

  if (articleList.length === 0) {
    articleList = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
      <span>
        No article liked
      </span>
    } />;
  }

  return (
    <div>

      <Nav />

      <div className="Banner" />

      <div className="Card HomeThemes">
        {articleList}
      </div>

      <Modal title={modalTitle} visible={isModalVisible} onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="link"
            href={modalUrl}
            target="_blank"
            type="primary"
            onClick={handleOk}
            loading={isModalLoading}
          >
            Go to article
          </Button>,
        ]}>
        {modalContent}
      </Modal>

    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFromWishList: function (article) {
      dispatch({ type: 'removeArticle', article })
    },
    readArticleInWishlist: function (article) {
      dispatch({ type: 'readArticle', article })
    }
  }
}

function mapStateToProps(state) {
  return { wishList: state.wishList, token: state.authToken }
}
export default connect(mapStateToProps, mapDispatchToProps)(ScreenMyArticles);
