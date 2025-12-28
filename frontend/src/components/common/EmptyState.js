import React from 'react';
import { motion } from 'framer-motion';
import { MdAccountBalanceWallet, MdReceiptLong } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

/**
 * Empty State Component - Wird angezeigt wenn keine Daten vorhanden sind
 * @param {string} type - 'transactions' oder 'wallet'
 */
const EmptyState = ({ type = 'transactions' }) => {
  const config = {
    transactions: {
      icon: MdReceiptLong,
      titleKey: 'emptyState.transactions.title',
      messageKey: 'emptyState.transactions.message',
      actionKey: 'emptyState.transactions.action',
      actionLink: '/add',
    },
    wallet: {
      icon: MdAccountBalanceWallet,
      titleKey: 'emptyState.wallet.title',
      messageKey: 'emptyState.wallet.message',
      actionKey: 'emptyState.wallet.action',
      actionLink: '/add',
    },
  };

  const { icon: Icon, titleKey, messageKey, actionKey, actionLink } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-full p-8 mb-6"
      >
        <Icon className="text-6xl text-blue-400 lg:text-7xl" />
      </motion.div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3 lg:text-2xl">
        <FormattedMessage id={titleKey} />
      </h3>

      {/* Message */}
      <p className="text-gray-500 mb-6 max-w-md lg:text-lg">
        <FormattedMessage id={messageKey} />
      </p>

      {/* Action Button */}
      <Link to={actionLink}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-blue text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 lg:px-10 lg:py-4 lg:text-lg"
        >
          <FormattedMessage id={actionKey} />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default EmptyState;
