// checkResponse.js
export const checkResponse = ({
    intervalId,
    audioRef,
    setUsedRadioButton,
    questionCheck,
    currentTurn,
    counter,
    updatePlayerPoints,
    setSuccess,
    successSound,
    nextTurn,
    setModalQuestion,
    setCounter,
    VALUE_INTERVAL_COUNTER,
    setError,
    errorSound,
    agregarElemento,
    questionGameIn,
    setQuestionCheck,
    SetTurnIndexSave,
  }) => {
    clearInterval(intervalId); // Detener el intervalo
    audioRef.current.currentTime = 0;
    audioRef.current.pause();
  
    function calculatePoints(round, counter) {
      let points;
      if (round === 0 || round === 1) {
        points = calculatePointsForRound(counter, 100, 85, 70, 60);
      } else if (round === 2 || round === 3) {
        points = calculatePointsForRound(counter, 200, 185, 170, 160);
      } else if (round === 4) {
        points = calculatePointsForRound(counter, 300, 285, 270, 260);
      }
      return points;
    }
  
    function calculatePointsForRound(counter, points15, points12, points10, pointsDefault) {
      if (counter >= 15) {
        return points15;
      } else if (counter >= 12) {
        return points12;
      } else if (counter >= 8) {
        return points10;
      } else {
        return pointsDefault;
      }
    }
  
    setUsedRadioButton(true);
    if (questionCheck && questionCheck.correct) {
      const points = calculatePoints(currentTurn.round, counter);
      updatePlayerPoints(currentTurn.player, points);
      setSuccess(true);
      successSound.play();
      setTimeout(() => {
        SetTurnIndexSave((prev) => ({
          ...prev,
          round: currentTurn.round + 1,
          player: currentTurn.player + 1,
        }));
        setQuestionCheck(null);
        setUsedRadioButton(false);
        setSuccess(false);
        nextTurn();
        setModalQuestion(false);
        setCounter(VALUE_INTERVAL_COUNTER);
        successSound.pause();
      }, 3000);
    } else {
      setError(true);
      setUsedRadioButton(true);
      errorSound.play();
      setTimeout(() => {
        setQuestionCheck(null);
        SetTurnIndexSave((prev) => ({
          ...prev,
          round: currentTurn.round + 1,
          player: currentTurn.player + 1,
        }));
        setUsedRadioButton(false);
        setError(false);
        nextTurn();
        setCounter(VALUE_INTERVAL_COUNTER);
        setModalQuestion(false);
        errorSound.pause();
      }, 3000);
    }
  
    const cod = questionGameIn.id_question;
    agregarElemento(`${cod}`);
  };
  