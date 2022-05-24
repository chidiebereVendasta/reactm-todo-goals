/**
 * The store should have four parts. In this section, we'll be building the store.

The state  *

Get the state.  *

Listen to changes in the state. (subscribe and unsubscribe function) *

Update the state (dispatch method, reducers and combining reducers)
 */

const REMOVE_TODO = "REMOVE_TODO"
const  ADD_TODO = "ADD_TODO"
const ADD_GOAL =  "ADD_GOAL"


//Reducers: It helps us perform an update to the state. The reducer must be a pure function
function todoReducer(state = [], action){
    if(action.type === ADD_TODO){
        return state.concat([action.todo])
    }else if(action.type === REMOVE_TODO){
        return state.filter(todo => todo.id !== action.id)
    }
    return state
}

function goalReducer(state = [], action){
    if(action.type === ADD_GOAL){
        return state.concat([action.goal])
    }
    return state
}

//Library from Redux
function createStore(reducer){

    let state
    let listeners = [] //add all the callback functions passed to subscribe method as lsiteners

    const getState = () => state //returns the state of the store

    const subscribe = (listener) => { //helps us listen to changes in the store
        listeners.push(listener)

        return () => {
            listeners.filter(l => l !== listener)
        }
    }

    const dispatch = (action) => {
        state = reducer(state, action)

        //call all the listeners to let them know that the store was updated
        listeners.forEach(listener => listener())
    }

    return{
        getState,
        subscribe,
        dispatch
    }
}

//Library from Redux
function combineReducer(state = {}, action){
  return  {
       todos: todoReducer(state.todos, action),
       goals: goalReducer(state.goals, action),
    }
}

const store = createStore(combineReducer)

const unsubscribe = store.subscribe(() => {
    console.log("the new state is: ", store.getState())
})

store.subscribe(() => {
    console.log("the state changed")
})


store.dispatch(createTodo({
    id: 1,
    todoName: "sleep at 5pm",
    done: false
}))

store.dispatch(createGoal( {
    goalName: "save moeney",
    done: false
}))

// //unsubscribe()

store.dispatch(createTodo({
    id: 2,
    todoName: "Go to work",
    done: false
}))



store.dispatch(createGoal( {
    goalName: "bike",
    done: false
}))

store.dispatch(createGoal( {
    goalName: "run",
    done: false
}))

store.dispatch(createGoal( {
    goalName: "sell",
    done: false
}))

store.dispatch(removeTodo(1))

//Action creators: It helps to increase the predictability of our application state
function createTodo(todo){
    return {
        type: ADD_TODO,
        todo
    }
}

function createGoal(goal){
    return {
        type: ADD_GOAL,
        goal
    }
}

function removeTodo(id){
    return {
        type: REMOVE_TODO,
        id
    }
}




/**
    //Without Combine Reducers we can just store one slice state
    let state = [{ todoName: "Go to work", done: false}, { todoName: "Go for a workout", done: false}]

    //With Combine Reducers we can have different slice of our state tree
    let state2 = {
        todos: [{ todoName: "Go to work", done: false}, { todoName: "Go for a workout", done: false}],
        goals: [{...}]
        ///...
    }

    console.log(todoReducer(state, createTodo({
        todoName: "sleep at 5pm",
        done: false
    })))
 */




