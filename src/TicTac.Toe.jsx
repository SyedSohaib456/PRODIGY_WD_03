import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, GridItem, Text, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState('2P'); 

  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.200', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const buttonColor = useColorModeValue('gray.100', 'gray.700');
  const hoverColor = useColorModeValue('teal.200', 'teal.500');

  
  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setWinner(winner);
    } else if (!board.includes(null)) {
      setWinner('Tie');
    }
  }, [board]);

  
  useEffect(() => {
    if (gameMode === 'AI' && !isXNext && !winner) {
      const aiTimeout = setTimeout(() => {
        const aiMove = getAIMove(board);
        if (aiMove !== null) {
          makeMove(aiMove, false); 
        }
      }, 500);

      return () => clearTimeout(aiTimeout);
    }
  }, [isXNext, gameMode, board, winner]);

  const handleClick = (index) => {
    if (board[index] || winner || (gameMode === 'AI' && !isXNext)) return;
    makeMove(index, isXNext);
  };

  const makeMove = (index, isXTurn) => {
    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXTurn);
  };

  const getAIMove = (currentBoard) => {
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === null) {
        
        const boardCopy = [...currentBoard];
        boardCopy[i] = 'O';
        if (checkWinner(boardCopy) === 'O') {
          return i;
        }
      
        boardCopy[i] = 'X';
        if (checkWinner(boardCopy) === 'X') {
          return i;
        }
      }
    }
    
    return currentBoard.indexOf(null);
  };

 
  const checkWinner = (newBoard) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }

    return null;
  };


  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  
  const toggleGameMode = () => {
    setGameMode((prevMode) => (prevMode === '2P' ? 'AI' : '2P'));
    resetGame();
  };

  return (
    <Box className={`flex flex-col items-center justify-center h-screen ${bg} transition duration-500`}>
      <Text fontSize="3xl" fontWeight="bold" mb={4} color={textColor}>
        Tic Tac Toe - {gameMode === '2P' ? 'Two Player' : 'Play with AI'}
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={4} className="w-80 md:w-96">
        {board.map((value, index) => (
          <GridItem key={index}>
            <Button
              w="full"
              h="20"
              fontSize="3xl"
              bg={buttonColor}
              onClick={() => handleClick(index)}
              className={`shadow-md transition-all duration-300 ${
                value === 'X' ? 'text-blue-500' : 'text-red-500'
              }`}
              _hover={{ bg: hoverColor }}
              isDisabled={winner || (gameMode === 'AI' && !isXNext)}
            >
              {value}
            </Button>
          </GridItem>
        ))}
      </Grid>
      {winner && (
        <Box mt={4} className="text-center">
          {winner === 'Tie' ? (
            <Text fontSize="xl" fontWeight="bold" color="yellow.400">
              It's a Tie!
            </Text>
          ) : (
            <Text fontSize="xl" fontWeight="bold" color="green.400">
              Winner: {winner}
            </Text>
          )}
        </Box>
      )}
      <VStack spacing={4} mt={4}>
        <Button colorScheme="teal" onClick={resetGame}>
          Reset Game
        </Button>
        <Button colorScheme="purple" onClick={toggleGameMode}>
          Switch to {gameMode === '2P' ? 'AI Mode' : 'Two Player Mode'}
        </Button>
        <Button onClick={toggleColorMode}>
          Toggle {useColorModeValue('Dark', 'Light')} Mode
        </Button>
      </VStack>
    </Box>
  );
};

export default TicTacToe;
