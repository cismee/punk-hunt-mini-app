import "nes.css/css/nes.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import "./fonts/Pixel_NES.otf"
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Splash from './Splash';
import Ducks from './Ducks';
import Zapp from './Zapp';
import Ded from './Ded';
import Stats from './Stats';
import ChatInterface from './ChatInterface';
import Faq from './Faq';
import HowToPlay from './HowToPlay';
import Nav from './nav';
import SubNav from './subnav';
import Terms from './Terms';
import SoundController from './SoundController'; // Updated import
import reportWebVitals from './reportWebVitals';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './wagmi-config';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <SoundController />
          <div className="sticky-top">
            <Nav />
            <SubNav />
          </div>
          <Splash />
          <HowToPlay />
          <Ducks />
          <Zapp />
          <Ded />
          <Stats />
          <Faq />
          <Terms />
          <ChatInterface />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

reportWebVitals();