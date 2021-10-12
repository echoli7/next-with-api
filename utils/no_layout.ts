import React, { FC } from 'react'

function doNotUseLayout(Component) {
    Component.noLayout = true
    return Component
}

doNotUseLayout.param = "noLayout"

export default doNotUseLayout