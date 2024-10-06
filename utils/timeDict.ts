
/* Eu criei esse dicionário para me ajudar a lidar com operações de tempo com Epoch em millisegundos, já que o
module nativo usageStats funciona com essa medida de tempo. */

const time = {  // Dicionário de tempo em milissegundos
    second: 1000,
    minute: 1000*60,
    hour: 1000*60*60,
    day: 1000*60*60*24,
    week: 1000*60*60*24*7,
    month: 1000*60*60*24*30,
    year: 1000*60*60*24*365
}

const getTimeAgo = () => {  // Dicionário de tempo atrás. Acho que é inútil agora.
    const now = Date.now()

    return {
        second: now - time.second,
        minute: now - time.minute,
        hour: now - time.hour,
        day: now - time.day,
        week: now - time.week,
        month: now - time.month,
        year: now - time.year
    }
}


const getAllDay = (): number => {
    const allDayTodayDate = new Date() 
    allDayTodayDate.setHours(0, 0, 0, 0);
    allDayTodayDate.setDate(allDayTodayDate.getDate()+1)
    allDayTodayDate.setMilliseconds(allDayTodayDate.getMilliseconds()-1)
    return allDayTodayDate.getTime()
}

const getAllDayMinus = () => {
    const allDayToday = getAllDay()
    return {
        aDay: allDayToday - time.day + 1,
        aWeek: allDayToday - time.week + 1,
        aMonth: allDayToday - time.month + 1,
        aYear: allDayToday - time.year + 1
    }
}

export {time, getTimeAgo, getAllDay, getAllDayMinus }
