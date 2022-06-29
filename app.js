/**
 * The store should have four parts. In this section, we'll be building the store.

The state  *

Get the state.  *

Listen to changes in the state. (subscribe and unsubscribe function) *

Update the state (dispatch method, Actions, reducers and combining reducers)
 *
Our State Object looks like :
{ 
   todos: [],
   goals: []
}
 * 
 */
/**
 * 
 * - Hook our current custom Store (Redux) to UI. Where we want our UI to be a representation of ur state. 
 *     - We render a Raw UI
       - Make the UI be a representation of our state. A user from the UI will add items to the state of our store. 
       - We use the subscribe function from the store, to listen for changes in the state, reset the UI, then re-render the updated items
   - Create a custom middleware called "checkAndDispatch" for our app to help validate our dispatch action before we call our dispatch method
   - Replace our Custom Store with Redux (https://cdnjs.com/libraries/redux)
   - Add a Redux middleware between the Store.dispatch and Reducer
 */


function generateID () {
    return (Math.random() + 1).toString(36).substring(7);
};

const REMOVE_TODO = "REMOVE_TODO"
const  ADD_TODO = "ADD_TODO"
const ADD_GOAL =  "ADD_GOAL"
const REMOVE_GOAL =  "REMOVE_GOAL"
const TOGGLE_GOAL =  "TOGGLE_GOAL"


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
    }else if(action.type === REMOVE_GOAL){
        return state.filter(goal => goal.id !== action.id)
    }else if(action.type === TOGGLE_GOAL){
        return state.map(goal => goal.id !== action.id ? goal : Object.assign({}, goal, { complete: !goal.complete }))
    }
    return state
}

const store = Redux.createStore(Redux.combineReducers({
    todos: todoReducer,
    goals: goalReducer,
 }), Redux.applyMiddleware(validateTodoAndGoalReduxMiddleware, logActionAndState))


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

function removeGoal(id){
    return {
        type: REMOVE_GOAL,
        id
    }
}

function toggleGoal(id){
    return {
        type: TOGGLE_GOAL,
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

    /**
     * store.dispatch -> validateTodoAndGoalReduxMiddleware (to validate) -> reducer (updates the store and return the new state)
     */
    function validateTodoAndGoalReduxMiddleware(store){
        return function (next){
            return  function(action){
               // console.log(action)
                
                const { getState, dispatch } = store
                //console.log(getState())

                if(action.type === ADD_TODO && !action.todo.todoName){
                    alert("Hey enter a valid todo name")
                    return
                }
                
                if(action.type === ADD_GOAL && !action.goal.goalName){
                    alert("Hey enter a valid goal name")
                    return
                }

                return next(action) //the next middleware or your action being dispatched
            }
        }
    }

    function logActionAndState(){
        return next => action => {
            const {getState} = store
            console.log("Current state is", getState())
            console.log("state action", action);
            return next(action)
        }
    }
    // const rrr = (store) => (next) => (action) => {

    // }




