def distanceCal(currentTime, endTime, startTime, locationTime):
    timeLeft = endTime - currentTime + locationTime

    if timeLeft < 0:
        return None
    
    overall = endTime - startTime
    halfway = overall / 2
    timeLeft = timeLeft / 60

    if timeLeft <= halfway:
        distance = timeLeft * 1.2
    else:
        distance = halfway * 2

    return distance