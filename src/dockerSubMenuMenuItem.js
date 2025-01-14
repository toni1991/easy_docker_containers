"use strict";

const St = imports.gi.St;
const Gio = imports.gi.Gio; // For custom icons
const { PopupSubMenuMenuItem } = imports.ui.popupMenu;
const extensionUtils = imports.misc.extensionUtils;
const Me = extensionUtils.getCurrentExtension();
const { DockerMenuItem } = Me.imports.src.dockerMenuItem;
const GObject = imports.gi.GObject;
const { menuIcon } = Me.imports.src.menuIcon

/**
 * Get the status of a container from the status message obtained with the docker command
 *
 * @param {String} statusMessage The status message
 *
 * @return {String} The status in ['running', 'paused', 'stopped']
 */
const getStatus = (statusMessage) => {
  let status = "stopped";
  if (statusMessage.indexOf("Up") > -1) status = "running";
  if (statusMessage.indexOf("Paused") > -1) status = "paused";

  return status;
};

// Menu entry representing a Docker container
var DockerSubMenu = GObject.registerClass(
  class DockerSubMenu extends PopupSubMenuMenuItem {
    _init(projectName, containerName, containerStatusMessage) {
      super._init(`${projectName}${projectName?' ∘ ': ''}${containerName}`);

      switch (getStatus(containerStatusMessage)) {
        case "stopped":
          this.insert_child_at_index(
            menuIcon("docker-container-symbolic", "status-stopped"),
            1
          );

          this.menu.addMenuItem(
            new DockerMenuItem(
              containerName,
              "start",
              menuIcon("docker-container-start-symbolic")
            )
          );
          break;

        case "running":
          this.insert_child_at_index(
            menuIcon("docker-container-symbolic", "status-running"),
            1
          );

          this.menu.addMenuItem(
            new DockerMenuItem(
              containerName,
              "pause",
              menuIcon("docker-container-pause-symbolic")
            )
          );

          this.menu.addMenuItem(
            new DockerMenuItem(
              containerName,
              "stop",
              menuIcon("docker-container-stop-symbolic")
            )
          );

          this.menu.addMenuItem(
            new DockerMenuItem(
              containerName,
              "restart",
              menuIcon("docker-container-restart-symbolic")
            )
          );

          this.menu.addMenuItem(
            new DockerMenuItem(
              containerName,
              "exec",
              menuIcon("docker-container-exec-symbolic")
            )
          );
          break;

        case "paused":
          this.insert_child_at_index(
            menuIcon("docker-container-symbolic", "status-paused"),
            1
          );

          this.menu.addMenuItem(
            new DockerMenuItem(
              containerName,
              "unpause",
              menuIcon("docker-container-start-symbolic")
            )
          );
          break;

        default:
          this.insert_child_at_index(
            menuIcon(
              "docker-container-unavailable-symbolic",
              "status-undefined"
            ),
            1
          );
          break;
      }

      this.menu.addMenuItem(
        new DockerMenuItem(
          containerName,
          "logs",
          menuIcon("docker-container-logs-symbolic")
        )
      );
    }
  }
);
