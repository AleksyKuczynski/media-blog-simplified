// frontend/src/main/components/Footer/ContactModal.tsx
'use client';

import { useState } from 'react';
import { Modal } from '@/main/components/Interface/Modal/Modal';
import type { Dictionary } from '@/main/lib/dictionary';

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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = dictionary.footer.contact.modal.emailRequired;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = dictionary.footer.contact.modal.emailInvalid;
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = dictionary.footer.contact.modal.subjectRequired;
    }

    // Message validation
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

    // TODO: Replace with actual API call when backend is ready
    // For now, simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      setStatus({
        type: 'success',
        message: dictionary.footer.contact.modal.successMessage,
      });

      // Reset form after success
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
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    // Reset form state when closing
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
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Success/Error Messages */}
        {status.type !== 'idle' && (
          <div
            className={`
              px-4 py-3 rounded-lg text-sm font-medium
              ${status.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
              }
            `}
            role="alert"
          >
            {status.message}
          </div>
        )}

        {/* Email Field */}
        <div>
          <label 
            htmlFor="contact-email" 
            className="block text-sm font-medium text-on-sf mb-2"
          >
            {dictionary.footer.contact.modal.emailLabel}
            <span className="text-red-500 ml-1" aria-label="обязательное поле">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={dictionary.footer.contact.modal.emailPlaceholder}
            className={`
              w-full px-4 py-3 
              bg-sf-cont border rounded-lg
              text-on-sf placeholder:text-on-sf-var
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-pr-fix focus:border-transparent
              ${errors.email 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-ol-var hover:border-ol-var/60'
              }
            `}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label 
            htmlFor="contact-subject" 
            className="block text-sm font-medium text-on-sf mb-2"
          >
            {dictionary.footer.contact.modal.subjectLabel}
            <span className="text-red-500 ml-1" aria-label="обязательное поле">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder={dictionary.footer.contact.modal.subjectPlaceholder}
            maxLength={200}
            className={`
              w-full px-4 py-3 
              bg-sf-cont border rounded-lg
              text-on-sf placeholder:text-on-sf-var
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-pr-fix focus:border-transparent
              ${errors.subject 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-ol-var hover:border-ol-var/60'
              }
            `}
            disabled={isSubmitting}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label 
            htmlFor="contact-message" 
            className="block text-sm font-medium text-on-sf mb-2"
          >
            {dictionary.footer.contact.modal.messageLabel}
            <span className="text-red-500 ml-1" aria-label="обязательное поле">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={dictionary.footer.contact.modal.messagePlaceholder}
            rows={6}
            maxLength={5000}
            className={`
              w-full px-4 py-3 
              bg-sf-cont border rounded-lg
              text-on-sf placeholder:text-on-sf-var
              transition-colors duration-200
              resize-none
              focus:outline-none focus:ring-2 focus:ring-pr-fix focus:border-transparent
              ${errors.message 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-ol-var hover:border-ol-var/60'
              }
            `}
            disabled={isSubmitting}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.message}
            </p>
          )}
          <p className="mt-1.5 text-xs text-on-sf-var">
            {formData.message.length} / 5000
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || status.type === 'success'}
            className="
              flex-1 px-6 py-3 
              bg-pr-cont hover:bg-pr-fix 
              text-on-pr font-medium rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-pr-fix focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? 'Отправка...' : dictionary.footer.contact.modal.submitButton}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="
              px-6 py-3 
              bg-transparent border-2 border-ol-var
              text-on-sf-var hover:text-on-sf hover:border-ol-var/60
              font-medium rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-pr-fix focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {dictionary.footer.contact.modal.cancelButton}
          </button>
        </div>
      </form>
    </Modal>
  );
}