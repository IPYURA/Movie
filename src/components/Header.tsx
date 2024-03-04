import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { motion, useScroll, useAnimation } from "framer-motion";
import { useForm } from "react-hook-form";

const navVarients = {
  top: { background: "rgba(0,0,0,0)" },
  scroll: { background: "rgba(0,0,0,1)" },
};

const Header = () => {
  const { register, handleSubmit } = useForm();
  //밑에 Form 만들고 submit에 넣기
  const onValid = (data: any) => {
    console.log(data);
    navigate(`/search?keyword=${data.keyword}`);
  };
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");
  const { scrollY } = useScroll();
  const navAnimation = useAnimation();

  useEffect(() => {
    scrollY.on("change", () => {
      if (scrollY.get() > 128) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY]);
  const toggleSearch = () => {
    setSearchOpen(true);
  };

  return (
    <Nav variants={navVarients} animate={navAnimation} initial="top">
      <Col>
        <Logo />
        <Items>
          <Item>
            <Link to="/">Home{homeMatch && <Circle />}</Link>
          </Item>
          <Item>
            <Link to="/tv">TV Shows{tvMatch && <Circle />}</Link>
          </Item>
        </Items>
      </Col>

      <Col>
        <Search onClick={toggleSearch}>
          <Input placeholder="Search for movie or TV Show..." />
          {/* <Input
            animate={{ scaleX: searchOpen ? 1 : 0 }}
            placeholder="Search for movie or TV Show..."
          /> */}
        </Search>
      </Col>
    </Nav>
  );
};
export default Header;

const Nav = styled(motion.nav)`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #191919;
  font-size: 18px;
  font-weight: 700;
  color: #000;
  padding: 0 30px;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.svg`
  width: 95px;
  height: 25px;
  margin-right: 50px;
  background: url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/400px-Netflix_2015_logo.svg.png")
    no-repeat center center / cover;
  transition: 0.4s;
  cursor: pointer;
  &:hover {
    filter: grayscale(100%);
    // filter: drop-shadow(rgba(255,255,255,0.8));
  }
`;
const Items = styled.ul`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Item = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;
  transition: 0.3s;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  &:hover {
    color: ${(props) => props.theme.white.darker};
  }
`;
const Circle = styled.span`
  background: ${(props) => props.theme.red};
  margin: 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  position: absolute;
  bottom: -15px;
  left: 0;
  right: 0;
`;
const Search = styled.span`
  position: relative;
  width: 23px;
  height: 22px;
  color: #fff;
  display: flex;
  align-items: center;
  background: url("https://uxwing.com/wp-content/themes/uxwing/download/user-interface/search-icon.png")
    no-repeat center center / cover;
  filter: invert(100%);
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    filter: invert(70%);
  }
`;
// const Input = styled(motion.input)`
//   transform-origin: right center;
// `;
const Input = styled.input`
  transform-origin: right center;
  position: absolute;
  left: -170px;
  background: transparent;
  outline: none;
  border: 1px solid #000;
  padding: 5px 10px;
  color: #000;
`;
