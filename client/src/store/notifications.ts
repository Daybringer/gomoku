import { defineStore } from "pinia";

export enum NotificationType {
  Success,
  Error,
  Warning,
  Info,
}

export interface Notification {
  UUID: string;
  type: NotificationType;
  text: string;
  autoDismiss: boolean;
  duration: number;
  imageName?: string;
}

export const useNotificationsStore = defineStore("notificationsStore", {
  state: () => ({
    // Has to be an array so we can use `notifications` to display components using v-for
    notifications: [] as Notification[],
  }),
  actions: {
    createUUID(length?: number): string {
      const UUIDLength = length || 6;

      return Math.random()
        .toString(36)
        .substring(2, UUIDLength);
    },
    createNotification(
      type: NotificationType,
      text: string,
      autoDismiss: boolean = true,
      duration?: number,
      imageName?: string
    ) {
      const DEFAULT_DURATION = 6;
      const notification: Notification = {
        UUID: this.createUUID(),
        type,
        text,
        autoDismiss,
        duration: duration || DEFAULT_DURATION,
      };

      if (imageName) {
        notification.imageName = imageName;
      }

      this.notifications.push(notification);
      this.timeoutRemoval(notification.UUID, notification.duration);
    },
    removeNotification(UUID: string) {
      let notificationIx = -1;
      notificationIx = this.notifications.findIndex(
        (notification) => notification.UUID === UUID
      );

      if (notificationIx !== -1) {
        this.notifications.splice(notificationIx, 1);
      }
    },
    timeoutRemoval(UUID: string, timeInSecs: number) {
      setTimeout(() => {
        this.removeNotification(UUID);
      }, timeInSecs * 1000);
    },
  },
});
