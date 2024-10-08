export function updateTurnState(SetTurnIndexSave, currentTurn, setQuestionCheck, setCounter, setModalQuestion, nextTurn) {
    SetTurnIndexSave((prev) => {
      return {
        ...prev,
        round: currentTurn.round + 1,
        player: currentTurn.player + 1,
      };
    });
  
    setQuestionCheck(null);
    setCounter(VALUE_INTERVAL_COUNTER);
    setModalQuestion(false);
    nextTurn();
  }
  