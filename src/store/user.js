

const initialState = {
    profile: {
        fullName: "hoang hai long",
        point: 20,
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU"
    }
};

export default (state = initialState, action) => {
    let {
        showHeader
    } = state

    switch (action.type) {
        default:
            return state;
    }
};