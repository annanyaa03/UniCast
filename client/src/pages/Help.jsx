import React, { useState } from 'react';
import { 
  Search, HelpCircle, Book, MessageSquare, 
  Shield, Play, CreditCard, ChevronRight,
  ExternalLink, Mail, MessageCircle, Phone
} from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: <Play size={24} />, title: 'Getting Started', desc: 'New to UniCast? Learn the basics of watching and uploading.' },
    { icon: <Shield size={24} />, title: 'Account & Privacy', desc: 'Manage your profile, security settings, and data privacy.' },
    { icon: <Book size={24} />, title: 'Campus Guides', desc: 'How to use UniCast for academic departments and college clubs.' },
    { icon: <MessageSquare size={24} />, title: 'Community', desc: 'Interacting with others, comments, and community guidelines.' }
  ];

  const faqs = [
    { q: 'How do I join a college club?', a: 'Navigate to the "Clubs" page from the sidebar, find a club that interests you, and click the "Join" button. Some clubs may require approval.' },
    { q: 'Can I upload videos as a student?', a: 'Yes! Every student with a verified .edu email can upload campus-related content, shorts, and project demonstrations.' },
    { q: 'How does "Live" broadcasting work?', a: 'Live events are usually managed by official departments or authorized clubs. If you have permission, you can start a stream from the Upload dashboard.' },
    { q: 'Is my data secure?', a: 'We use industry-standard encryption and Supabase Auth to ensure your college credentials and personal data remain private.' }
  ];

  return (
    <div className="page-pad">
      {/* Hero Section */}
      <div className="help-hero" style={{ 
        textAlign: 'center', 
        padding: '64px 24px', 
        background: 'var(--gray-900)', 
        color: 'var(--white)',
        marginBottom: '48px'
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', color: 'var(--white)' }}>How can we help?</h1>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input 
            type="text" 
            placeholder="Search for articles, guides, or FAQs..." 
            style={{ 
              width: '100%', 
              padding: '16px 16px 16px 48px', 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--white)',
              fontSize: '16px'
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="page-pad--narrow" style={{ padding: 0 }}>
        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
          {categories.map((cat, i) => (
            <div key={i} className="card" style={{ 
              padding: '32px', 
              border: '1px solid var(--border)', 
              transition: 'var(--transition)',
              cursor: 'pointer'
            }}>
              <div style={{ color: 'var(--gray-900)', marginBottom: '16px' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{cat.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: '1.6' }}>{cat.desc}</p>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)' }}>
                Learn more <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <details key={i} style={{ 
                border: '1px solid var(--border)', 
                padding: '20px 24px',
                cursor: 'pointer'
              }}>
                <summary style={{ fontSize: '15px', fontWeight: 600, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <ChevronRight size={16} style={{ transition: 'transform 0.2s' }} className="details-arrow" />
                </summary>
                <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--gray-500)', lineHeight: '1.7' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div style={{ 
          background: 'var(--gray-50)', 
          padding: '48px', 
          textAlign: 'center', 
          border: '1px solid var(--border)' 
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Still need help?</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>Our support team is available Monday to Friday, 9am - 5pm.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--white)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-900)' }}>
                <Mail size={20} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Email Support</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--white)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-900)' }}>
                <MessageCircle size={20} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Live Chat</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--white)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-900)' }}>
                <Phone size={20} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Call Us</span>
            </div>
          </div>
          
          <button className="btn btn--primary" style={{ marginTop: '40px' }}>
            Contact Us Now
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        details[open] .details-arrow { transform: rotate(90deg); }
        .card:hover { border-color: var(--gray-900) !important; box-shadow: var(--shadow); transform: translateY(-4px); }
      `}} />
    </div>
  );
};

export default Help;
