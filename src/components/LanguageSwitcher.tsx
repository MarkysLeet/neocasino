import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SupportedLng } from '../lib/locales';

const languages: { code: SupportedLng; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const current = languages.find((lng) => lng.code === i18n.language) ?? languages[0];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="focus-ring rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-neon/50 hover:text-white">
        {current.label}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 -translate-y-2"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Menu.Items className="glass-panel absolute right-0 mt-2 w-32 rounded-2xl p-2 shadow-card">
          {languages.map((lng) => (
            <Menu.Item key={lng.code}>
              {({ active }) => (
                <button
                  type="button"
                  className={classNames(
                    'w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition focus:outline-none',
                    active ? 'bg-white/10 text-neon' : 'text-white/70'
                  )}
                  onClick={() => i18n.changeLanguage(lng.code)}
                >
                  {lng.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSwitcher;
