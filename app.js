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

store.subscribe(() => {
    //reset the lists
    document.getElementById('todos').innerHTML = ""
    document.getElementById('goals').innerHTML = ""

    //render the new list
    const { todos, goals } = store.getState() //get the new updated store state
    todos.forEach(addTodoToDom)
    goals.forEach(addGaolToDom)
})

/*
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
*/

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

    /**
     * validateTodoAndGoal (To validate our input) ->  store.dispatch -> reducer (updates the store and return the new state)
     */
    function  validateTodoAndGoal(action, dispatch){

        if(action.type === ADD_TODO && !action.todoName){
            alert("Hey enter a valid todo name")
            return
        }else if(action.type === ADD_GOAL && !action.goalName){
            alert("Hey enter a valid goal name")
            return
        }

        return dispatch(action)
    }


    function addTodo(){
        const todoInput = document.getElementById("todo-Input")
        const todoValue = todoInput.value

        todoInput.value = '';

        //update the store
        store.dispatch(createTodo({
            id: generateID(),
            todoName: todoValue,
            done: false
        }))
        // validateTodoAndGoal(createTodo({
        //     id: generateID(),
        //     todoName: todoValue,
        //     done: false
        // }), store.dispatch)
    }

    function addGoal(){
        const goalInput = document.getElementById("goal-Input")
        const goalValue = goalInput.value

        goalInput.value = ''; //clear the goal input

        //update the store
        store.dispatch(createGoal({
            id: generateID(),
            goalName: goalValue,
            done: false
        }))
        // validateTodoAndGoal(createGoal({
        //     id: generateID(),
        //     goalName: goalValue,
        //     done: false
        // }) ,store.dispatch)
    }

    function toggleGoalCompleted(id){


        store.dispatch(toggleGoal(id))
    }

    function createRemoveButton(goalId) {
        const removeGoalButton = document.createElement('button')
        removeGoalButton.innerHTML = 'X'

        removeGoalButton.addEventListener("click", function() {
            store.dispatch(removeGoal(goalId))
        })

        return removeGoalButton
    }

    function addTodoToDom(todo){
        const node = document.createElement('li') //<li></li>
      const text = document.createTextNode(todo.todoName) //whateverName
      node.appendChild(text) //<li>whateverName</li>

      document.getElementById('todos')
        .append(node) //<ul><li>whateverName</li></ul>
    }

    function addGaolToDom(goal){
        const node = document.createElement('li')
        const text = document.createElement('span')
      text.innerHTML = goal.goalName
      node.appendChild(text) 
      node.appendChild(createRemoveButton(goal.id))

      node.style.textDecoration = goal.complete ? "line-through" : "none"
      node.style.color = goal.complete ? "green" : "red"

      text.addEventListener("click", () => toggleGoalCompleted(goal.id));

      document.getElementById('goals')
        .append(node) 
    }

    document.getElementById("add-todo-btn").addEventListener("click", addTodo);
    document.getElementById("add-goal-btn").addEventListener("click", addGoal);



