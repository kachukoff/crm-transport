import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ToastContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatDate } from '../lib/format';

function Profile() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});

  const changePassword = useMutation({
    mutationFn: (data) => api.patch('/auth/password', data),
    onSuccess: () => {
      toast.success(t('profile.passwordChanged'));
      setFormData({ current_password: '', new_password: '', confirm_password: '' });
      setErrors({});
    },
    onError: (error) => {
      toast.error(error.message || t('profile.passwordError'));
    },
  });

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.current_password.trim()) {
      nextErrors.current_password = t('profile.errors.required');
    }

    if (!formData.new_password) {
      nextErrors.new_password = t('profile.errors.required');
    } else if (formData.new_password.length < 8) {
      nextErrors.new_password = t('profile.errors.min');
    } else if (
      !/[A-Za-zА-Яа-я]/.test(formData.new_password)
      || !/\d/.test(formData.new_password)
    ) {
      nextErrors.new_password = t('profile.errors.letterDigit');
    } else if (formData.new_password === formData.current_password) {
      nextErrors.new_password = t('profile.errors.same');
    }

    if (!formData.confirm_password) {
      nextErrors.confirm_password = t('profile.errors.required');
    } else if (formData.confirm_password !== formData.new_password) {
      nextErrors.confirm_password = t('profile.errors.mismatch');
    }

    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    changePassword.mutate({
      current_password: formData.current_password,
      new_password: formData.new_password,
    });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('profile.title')}</h2>
          <p className="page-header__subtitle">{t('profile.subtitle')}</p>
        </div>
      </div>

      <div className="profile">
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">{t('profile.personal')}</h3>
          </div>
          <div className="profile__info">
            <div className="profile__row">
              <div className="profile__label">{t('profile.fullName')}</div>
              <div className="profile__value">{user.full_name}</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('profile.email')}</div>
              <div className="profile__value">{user.email}</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('profile.role')}</div>
              <div className="profile__value">
                <span className={`badge ${
                  user.role === 'admin' ? 'badge--danger' :
                  user.role === 'manager' ? 'badge--primary' : 'badge--info'
                }`}>
                  {t(`roles.${user.role}`, { defaultValue: user.role })}
                </span>
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('profile.registeredAt')}</div>
              <div className="profile__value">
                {formatDate(user.created_at, i18n.language)}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h3 className="card__title">{t('profile.security')}</h3>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-group__label" htmlFor="current_password">
                {t('profile.currentPassword')}
              </label>
              <input
                className="input"
                id="current_password"
                name="current_password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.current_password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.current_password)}
                disabled={changePassword.isPending}
              />
              {errors.current_password && (
                <span className="form-group__hint" style={{ color: 'var(--color-danger)' }}>
                  {errors.current_password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="new_password">
                {t('profile.newPassword')}
              </label>
              <input
                className="input"
                id="new_password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                placeholder={t('profile.newPasswordPlaceholder')}
                value={formData.new_password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.new_password)}
                disabled={changePassword.isPending}
              />
              <span className="form-group__hint">{t('profile.passwordHint')}</span>
              {errors.new_password && (
                <span className="form-group__hint" style={{ color: 'var(--color-danger)' }}>
                  {errors.new_password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="confirm_password">
                {t('profile.confirmPassword')}
              </label>
              <input
                className="input"
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                placeholder={t('profile.confirmPasswordPlaceholder')}
                value={formData.confirm_password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.confirm_password)}
                disabled={changePassword.isPending}
              />
              {errors.confirm_password && (
                <span className="form-group__hint" style={{ color: 'var(--color-danger)' }}>
                  {errors.confirm_password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? t('profile.saving') : t('profile.savePassword')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;