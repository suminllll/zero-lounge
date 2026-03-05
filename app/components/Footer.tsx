'use client'

import { useState } from 'react'
import PrivacyPolicyModal from './footer/PrivacyPolicyModal'
import TermsModal from './footer/TermsModal'
import ContactModal from './footer/ContactModal'

type ModalType = 'privacy' | 'terms' | 'contact' | null

export default function Footer() {
  const [openModal, setOpenModal] = useState<ModalType>(null)

  return (
    <>
      <footer className="w-full bg-secondary text-primary">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs">&copy; 2026 ZERO LOUNGE. All rights reserved.</p>
            <div className="flex gap-6">
              <button
                onClick={() => setOpenModal('privacy')}
                className="text-xs hover:text-primary transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setOpenModal('terms')}
                className="text-xs hover:text-primary transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {openModal === 'privacy' && <PrivacyPolicyModal onClose={() => setOpenModal(null)} />}
      {openModal === 'terms' && <TermsModal onClose={() => setOpenModal(null)} />}
      {openModal === 'contact' && <ContactModal onClose={() => setOpenModal(null)} />}
    </>
  )
}
