var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'menu', from: 'menu', to: 'logout' }
    ],
    methods: {
        MenuScreen: async function() {
          let menuValues = await $.getJSON('js/screens/menu.json')
           return menuValues;
        }
    }
});