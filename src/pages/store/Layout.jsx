import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Outlet } from 'react-router';
import ScrollToTop from '../../components/ScrollToTop';

function Layout(props) {
    return (
        <div className='layout-root'>
            <ScrollToTop/>
            <Header/>
            <section className='layout-content'>
                <Outlet/>
            </section>
            <Footer/>
        </div>
    );
}

export default Layout;