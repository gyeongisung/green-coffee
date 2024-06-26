import React, { useEffect, useState } from "react";
import { deleteCart, getCartList } from "../api/menuAxios";
import MenuCartItems from "../components/menucart/MenuCartItems";
import { MenuCartWrap } from "../styles/MenuCartStyle";
import ChangeOption from "../components/menucart/ChangeOption";
import {
  getCartTotalPrice,
  putCartQuaMinus,
  putCartQuaPlus,
} from "../api/cartAxios";
import { useNavigate } from "react-router";
import Loading from "../components/Loading";

const dummy = [
  {
    id: 1,
    title: "대구광역시 중구 중앙로점",
  },
  {
    id: 2,
    title: "대구광역시 중구 종로점",
  },
  {
    id: 3,
    title: "대구광역시 수성구 범어점",
  },
  {
    id: 4,
    title: "대구광역시 북구 경대점",
  },
  {
    id: 5,
    title: "대구광역시 서구 두류점",
  },
];
const MenuCart = () => {
  const [menuCartData, setMenuCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const [payload, setPayload] = useState([
    {
      cartmenu_id: menuCartData.cartmenu_id,
      name: menuCartData.name,
      img: menuCartData.menu?.menu_imgurl,
      ice: menuCartData.ice,
      shot: menuCartData.shot,
      cream: menuCartData.cream,
      quantity: menuCartData.quantity,
      menu_price: menuCartData.menu_price,
      menu_id: "",
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const navigate = useNavigate();

  const handleDecrease = async (id, quantity) => {
    await putCartQuaMinus(id);
    setPayload({ ...payload, quantity: quantity });
  };

  const handleIncrease = async (id, quantity) => {
    await putCartQuaPlus(id);
    setPayload({ ...payload, quantity: quantity });
  };
  const openChangeOption = id => {
    setPayload({ ...payload, menu_id: id });
    setModalOpen(true);
  };

  const handleMove = () => {
    navigate("/order");
  };

  const handleDelete = async (id, quantity, size, ice, shot, cream) => {
    const formData = {
      menuId: id,
      quantity: quantity,
      size: size,
      ice: ice,
      shot: shot,
      cream: cream,
    };
    try {
      await deleteCart(formData);
      getCartList(setMenuCartData);
      getCartTotalPrice(setTotalPrice);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      await getCartList(setMenuCartData);
      await getCartTotalPrice(setTotalPrice);
      setIsPending(false);
    };
    fetchData();
  }, [payload.quantity]);
  console.log(menuCartData);
  return (
    <MenuCartWrap>
      <div className="mypage_menu_cart">
        {isPending ? (
          <div className="cart-loading">
            <Loading />
          </div>
        ) : menuCartData.length === 0 ? (
          <div className="cart-noitem">
            <span>장바구니가 텅 ~ 텅 ~</span>
            <button onClick={handleMove}>주문하러 가기</button>
          </div>
        ) : (
          <>
            <MenuCartItems
              menuCartData={menuCartData}
              openChangeOption={openChangeOption}
              totalPrice={totalPrice}
              handleDelete={handleDelete}
              handleIncrease={handleIncrease}
              handleDecrease={handleDecrease}
              dummy={dummy}
            />
          </>
        )}
      </div>
      {modalOpen && (
        <ChangeOption
          menuCartData={menuCartData}
          setShowModal={setModalOpen}
          handleIncrease={handleIncrease}
          handleDecrease={handleDecrease}
          payload={payload}
        />
      )}
    </MenuCartWrap>
  );
};

export default MenuCart;
