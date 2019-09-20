function renderingConditionSatisfied(guards) {
    // Guard - returns true/false(should a component render or not). Passed as attribute tag as array of functions.

    if(!guards) {
        return true;
    }

    let shouldRender = true;
    
    
    guards.forEach(func => {
        if(func.call() === false) {
            shouldRender = false;
            return;
        }
    })

    return shouldRender;
}

export default renderingConditionSatisfied;