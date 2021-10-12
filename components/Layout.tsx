import React, { FC } from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import { useSession } from 'next-auth/client'
import Container from './container'
import HomeNav from './homeNav'

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session] = useSession()


    return (
        <Pane>
            <header>
                <HomeNav />
            </header>
            <main>
                {children}
            </main>
            <footer>
                <Pane background="overlay" paddingY={majorScale(9)}>
                    <Container>hello</Container>
                </Pane>
            </footer>
        </Pane>

    )

}

Layout.defaultProps = {
    children: <div></div>
}

export default Layout
