export default {
    toggleChildren (state, payload) {
        state.links[payload.unique].show = payload.status
    },
    toggleTopAccordion (state, payload) {
        const me = this
        let target = document.getElementById(`Ko0f${payload.unique}${payload.parent.id}6zXs`),
            description = target.querySelector('._k0dr0cCaXS65')

        state.links.forEach((parent, i) => {
            let element = document.getElementById(`Ko0f${i}${parent.id}6zXs`)

            if (payload.parent.id == parent.id) {
                parent.show ^= true
                description.style.height = (!parent.show) ? '0px' : `${description.scrollHeight}px`
            } else {
                parent.show = false
                if (element.querySelector('._k0dr0cCaXS65')) {
                    element.querySelector('._k0dr0cCaXS65').style.height = '0px'
                }
            }
        })
    },
    
    accordionTopChecker (state) {
        const me = this
        state.links.forEach((parent, i) => {
            parent.show = false
        })
    }
}
