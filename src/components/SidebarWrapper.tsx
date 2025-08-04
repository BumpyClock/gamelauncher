import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamepadContext } from '../contexts/GamepadContext';
import './sidebar-element';

interface SidebarWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const gamepadContext = useContext(GamepadContext);

  useEffect(() => {
    // Make gamepad context available globally for the Lit element
    (window as any).gamepadContext = gamepadContext;
    
    return () => {
      delete (window as any).gamepadContext;
    };
  }, [gamepadContext]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Update the isOpen property
    (sidebar as any).isOpen = isOpen;

    // Handle navigation events from the Lit element
    const handleNavigate = (event: CustomEvent) => {
      navigate(event.detail.path);
    };

    // Handle close events from the Lit element
    const handleClose = () => {
      onClose();
    };

    sidebar.addEventListener('navigate', handleNavigate as any);
    sidebar.addEventListener('close-sidebar', handleClose);

    return () => {
      sidebar.removeEventListener('navigate', handleNavigate as any);
      sidebar.removeEventListener('close-sidebar', handleClose);
    };
  }, [navigate, onClose, isOpen]);

  return <sidebar-element ref={sidebarRef}></sidebar-element>;
};

export default SidebarWrapper;