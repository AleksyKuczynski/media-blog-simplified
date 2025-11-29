// frontend/src/features/layout/ContactModal.tsx
'use client';

import { useState } from 'react';
import type { Dictionary } from '@/config/i18n';
import { Modal } from '@/shared/ui/Modal/Modal';
import { CONTACT_MODAL_STYLES, getInputClasses, getStatusClasses } from './styles';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: Dictionary;
  fallbackEmail: string;
}

interface FormData {
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  email?: string;
  subject?: string;
  message?: string;
}

interface FormStatus {
  type: 'idle' | 'success' | 'error';
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactModal({ 
  isOpen, 
  onClose, 
  dictionary,
  fallbackEmail 
}: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = dictionary.footer.contact.modal.emailRequired;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = dictionary.footer.contact.modal.emailInvalid;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = dictionary.footer.contact.modal.subjectRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = dictionary.footer.contact.modal.messageRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'idle' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: dictionary.footer.contact.modal.successMessage,
      });

      setTimeout(() => {
        setFormData({ email: '', subject: '', message: '' });
        setErrors({});
        setStatus({ type: 'idle' });
        onClose();
      }, 2000);

    } catch (error) {
      setStatus({
        type: 'error',
        message: `${dictionary.footer.contact.modal.errorMessage} ${fallbackEmail}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({ email: '', subject: '', message: '' });
    setErrors({});
    setStatus({ type: 'idle' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={dictionary.footer.contact.modal.title}
      size="md"
      position="center"
    >
      <form onSubmit={handleSubmit} className={CONTACT_MODAL_STYLES.form.container}>
        {status.type !== 'idle' && (
          <div className={getStatusClasses(status.type)} role="alert">
            {status.message}
          </div>
        )}

        {/* Email Field */}
        <div className={CONTACT_MODAL_STYLES.field.wrapper}>
          <label htmlFor="contact-email" className={CONTACT_MODAL_STYLES.field.label}>
            {dictionary.footer.contact.modal.emailLabel}
            <span 
              className={CONTACT_MODAL_STYLES.field.required} 
              aria-label={dictionary.footer.contact.modal.requiredField}
            >
              *
            </span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={dictionary.footer.contact.modal.emailPlaceholder}
            className={getInputClasses(!!errors.email)}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className={CONTACT_MODAL_STYLES.field.error}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div className={CONTACT_MODAL_STYLES.field.wrapper}>
          <label htmlFor="contact-subject" className={CONTACT_MODAL_STYLES.field.label}>
            {dictionary.footer.contact.modal.subjectLabel}
            <span 
              className={CONTACT_MODAL_STYLES.field.required} 
              aria-label={dictionary.footer.contact.modal.requiredField}
            >
              *
            </span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder={dictionary.footer.contact.modal.subjectPlaceholder}
            maxLength={200}
            className={getInputClasses(!!errors.subject)}
            disabled={isSubmitting}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className={CONTACT_MODAL_STYLES.field.error}>
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className={CONTACT_MODAL_STYLES.field.wrapper}>
          <label htmlFor="contact-message" className={CONTACT_MODAL_STYLES.field.label}>
            {dictionary.footer.contact.modal.messageLabel}
            <span 
              className={CONTACT_MODAL_STYLES.field.required} 
              aria-label={dictionary.footer.contact.modal.requiredField}
            >
              *
            </span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={dictionary.footer.contact.modal.messagePlaceholder}
            rows={6}
            maxLength={5000}
            className={getInputClasses(!!errors.message, true)}
            disabled={isSubmitting}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className={CONTACT_MODAL_STYLES.field.error}>
              {errors.message}
            </p>
          )}
          <p className={CONTACT_MODAL_STYLES.field.hint}>
            {formData.message.length} / 5000
          </p>
        </div>

        {/* Action Buttons */}
        <div className={CONTACT_MODAL_STYLES.buttons.wrapper}>
          <button
            type="submit"
            disabled={isSubmitting || status.type === 'success'}
            className={CONTACT_MODAL_STYLES.buttons.primary}
          >
            {isSubmitting 
              ? dictionary.footer.contact.modal.submitting 
              : dictionary.footer.contact.modal.submitButton
            }
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className={CONTACT_MODAL_STYLES.buttons.secondary}
          >
            {dictionary.footer.contact.modal.cancelButton}
          </button>
        </div>
      </form>
    </Modal>
  );
}