import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import EmptyState from '../../components/EmptyState';

const NotificationsScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={{ padding: 12 }}>
        <EmptyState title="No notifications" subtitle="You're all caught up." />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
