import { calculatePoints } from './pointsCalculador';
import { updateTurnState } from './turnUpdater';


export const checkResponse = ({
  intervalId,
  audioRef,
  questionCheck,
  currentTurn,
  counter,
  setUsedRadioButton,
  setSuccess,
  successSound,
  SetTurnIndexSave,
  setQuestionCheck,
  setCounter,
  setModalQuestion,
  nextTurn,
  errorSound,
  setError,
  questionGameIn,
  agregarElemento,
  VALUE_INTERVAL_COUNTER
}) => {
  clearInterval(intervalId); // Detener el intervalo
  audioRef.current.currentTime = 0;
  audioRef.current.pause();

  setUsedRadioButton();

  if (questionCheck && questionCheck.correct) {
    const points = calculatePoints(currentTurn.round, counter);
    updatePlayerPoints(currentTurn.player, points);
    setSuccess(true);
    setUsedRadioButton(true);
    successSound.play();

    setTimeout(() => {
      updateTurnState(SetTurnIndexSave, currentTurn, setQuestionCheck, setCounter, setModalQuestion, nextTurn);
      setUsedRadioButton(false);
      setSuccess(false);
      successSound.pause();
    }, 3000);
  } else {
    setError(true);
    setUsedRadioButton(true);
    errorSound.play();

    setTimeout(() => {
      updateTurnState(SetTurnIndexSave, currentTurn, setQuestionCheck, setCounter, setModalQuestion, nextTurn);
      setUsedRadioButton(false);
      setError(false);
      errorSound.pause();
    }, 3000);
  }

  var cod = questionGameIn.id_question;
  agregarElemento(`${cod}`);
  cod = '';
};
