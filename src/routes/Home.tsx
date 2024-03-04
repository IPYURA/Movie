import React, { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

// const rowVariants = {
//   hidden: {
//     x: window.outerWidth + 10,
//   },
//   visible: {
//     x: 0,
//   },
//   exit: {
//     x: -window.outerWidth - 10,
//   },
// };

// const boxVariants = {
//   normal: { scale: 1 },
//   hover: {
//     zIndex: 99,
//     scale: 1.3,
//     y: -50,
//     transition: { delay: 2, type: "tween" },
//   },
// };
// const infoVariants = {
//   hover: { opacity: 1 },
// };

const offset = 6;

const Home = () => {
  const { scrollY } = useScroll();
  // console.log(scrollY);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  //useQuery는 기본적으로 키값을 갖고있다. 라벨의 역할
  const bigMovieMatch = useMatch("/movies/:movieId");
  //두 번째 인자값은 가져올 데이터
  console.log(data);
  console.log(data?.results);

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.movieId)
    );

  const history = useNavigate();

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 2;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    history(`/movies/${movieId}`);
  };

  const onOverlayClick = () => history("/");

  console.log("[clicked]", clickedMovie);
  return (
    <Wrapper style={{ background: "#1a1a1a", height: "200vh" }}>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgphoto={makeImagePath(data?.results[0].backdrop_path)}
          >
            <Layer></Layer>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          {/* <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                transition={{ type: "tween", duration: 1 }}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
            
                {data?.results
                  .slice(2)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover={{ scale: 1.1, zIndex: 1 }}
                      initial="normal"
                      transition={{ delay: 0.2 }}
                      $bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
               
              </Row>
            </AnimatePresence>
          </Slider> */}

          <Slider>
            <BoxWrap>
              {data?.results.slice(1).map((movie, index) => (
                <AnimatePresence key={index}>
                  <Box
                    key={movie.id}
                    onClick={() => onBoxClicked(movie.id)}
                    whileHover={{ scale: 1.1, zIndex: 1 }}
                    initial="normal"
                    transition={{ delay: 0.2 }}
                    $bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                </AnimatePresence>
              ))}
            </BoxWrap>
          </Slider>

          {/* <>--------------</> */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{
                    top: scrollY.get() + 100,
                  }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;

//style={{background: "#1a1a1a", height: "200vh"}}

const Wrapper = styled.div`
  background: "#000";
  width: 100vw;
  border: 2px solid yellowgreen;
  * {
    box-sizing: border-box;
  }
`;
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50vh;
`;
const Banner = styled.div<{ $bgphoto: string | undefined }>`
  position: relative;
  height: 100vh;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url("${(props) => props.$bgphoto}");
  background-size: cover;
`;
const Layer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #000, transparent);
`;
const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 20px;
  z-index: 2;
`;
const Overview = styled.p`
  font-size: 18px;
  width: 50%;
  z-index: 2;
`;

const Slider = styled.div`
  border: 1px solid gold;
  position: relative;

  padding: 0 10px;
  width: 100%;
  top: -100px;
`;

const BoxWrap = styled.div`
  width: 100%;
  border: 1px solid pink;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
`;

// const Row = styled(motion.div)`
//   width: 100%;
//   display: grid;
//   grid-template-columns: repeat(6, 1fr);
//   position: absolute;
//   grid-gap: 10px;
//   @media screen and (max-width: 1024px) {
//     grid-template-columns: repeat(5, 1fr);
//   }
// `;
const Row = styled.div`
  border: 1px solid pink;
  box-sizing: border-box;
  width: 100%;
  display: grid;

  padding: 30px;
  grid-template-columns: repeat(5, 1fr);
  position: absolute;
  grid-gap: 10px;
`;

const Box = styled(motion.div)<{ $bgphoto: string }>`
  background: #fff;
  background-image: url("${(props) => props.$bgphoto}");
  background-positon: center;
  background-repeat: no-repeat;
  background-size: cover;
  object-fit: contain;
  width: 100%;
  min-height: 200px;
`;

// const Box = styled(motion.div)<{ $bgphoto: string }>`
//   background: #fff;
//   background-image: url("${(props) => props.$bgphoto}");
//   background-positon: center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   height: 200px;
//   // color: ${(props) => props.theme.black.darker};
//   font-size: 30px;
//   &:first-child {
//     transform-origin: center left;
//   }
//   &:last-child {
//     transform-origin: center right;
//   }
//   position: relative;
//   cursor: pointer;
// `;
const Info = styled.div`
  background: ${(props) => props.theme.black.lighter};
  // background: linear-gradient(to bottom,transparent, #000);
  padding: 10px;
  opacity: 1;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;
const BigMovie = styled(motion.div)`
  z-index: 3;
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  background: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-positon: center center;
`;
const BigTitle = styled.h3`
  text-align: center;
  font-size: 26px;
  margin-top: 20px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigOverview = styled.div`
  padding: 20px;
  word-break: keep-all;
`;
