export function calculatePoints(round, counter) {
    if (round === 0 || round === 1) {
      return calculatePointsForRound(counter, 100, 85, 70, 60);
    } else if (round === 2 || round === 3) {
      return calculatePointsForRound(counter, 200, 185, 170, 160);
    } else if (round === 4) {
      return calculatePointsForRound(counter, 300, 285, 270, 260);
    }
  }
  
  export function calculatePointsForRound(counter, points15, points12, points10, pointsDefault) {
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
  