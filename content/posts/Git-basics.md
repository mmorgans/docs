+++
title = "Git basics"
date = 2024-08-21T11:00:00-05:00
draft = false
+++

## Introduction to Git and GitHub {#introduction-to-git-and-github}

It's easiest to think of Git (and other forms of source control) like a time machine.

-   When you make changes to your project, it's easy to see what has changed.
-   You have a perfect history of everything that's ever happened in your project, and can always revert to any point in that history.
-   Git allows you to work with other people on the same project, while guaranteeing that you won't mess up each other's work.
-   Git allows you to send and receive files from your computer to a server, making it easy to put your projects online.


## Concepts {#concepts}

**Commits:** Think of a commit as taking a snapshot of your project. Every time you make a commit, you are saving a record of what your project looks like at that moment in time. This allows you to track changes over time and gives you a perfect history of your entire project.

**Repositories:** Where your project lives. It’s like a folder that stores all of your code and the entire history of your project. Repositories can live on your local machine or be hosted online via platforms like GitHub.

**Staging Area:** The staging area is like a holding ground where you prepare changes before making a commit. Think of it as packing a suitcase for a trip. When you lay everything out on your bed, thinking about what you want to bring with you, you can still move around, remove, and add items. The bed would be the staging area, and "committing" would be closing and locking your suitcase.


## How GitHub Works {#how-github-works}

GitHub stores your Git repository online. While Git is entirely local (everything is stored on your computer), GitHub hosts your repository online so that you can share it and collaborate with other people.


## Branches and Pull Requests {#branches-and-pull-requests}

In Git, branches allow you to work on different versions of your project simultaneously. For example, if you are working on a major feature but you don’t want to disrupt the rest of the project, a branch would allow you to create an alternate timeline where you can make changes without affecting the main project.

**Pull Requests** are used when working with other people to propose changes. If someone has code that they want to contribute to the project, they create a pull request to merge their work. This allows other team members to review the code before it’s integrated.


## Glossary {#glossary}

Core Git Terms:

-   Repository (Repo): A project’s directory or storage space where your project’s files and their revision history are stored.
-   Commit: A snapshot of your project at a specific point in time. Each commit has a message and stores changes made to the code.
-   Branch: A separate line of development within the same repository. You can think of branches as different versions of your project that diverge from the main version (typically called main or master).
-   Clone: The process of creating a local copy of a repository from a remote server (such as GitHub).
-   Fork: A personal copy of someone else’s repository, typically used to suggest changes or to start independent development.
-   Pull Request (PR): A GitHub-specific feature. It allows developers to request that their code changes be merged into the main repository. It often involves code review before merging.
-   Merge: The process of combining changes from different branches into one. It typically happens after a pull request is approved.
-   Rebase: Similar to merging but instead of combining the changes from different branches, it rewrites the commit history by applying your changes on top of another branch. Useful for keeping a cleaner commit history.
-   Remote: A version of your project hosted on a remote server (such as GitHub, GitLab, or Bitbucket). The remote is usually referred to as origin.
-   Fetch: Retrieves the latest changes from the remote repository without applying them to your local repository.
-   Pull: Retrieves the latest changes from the remote repository and applies them to your current branch.
-   Push: Sends your committed changes to a remote repository (e.g., GitHub) so others can access them.
-   HEAD: The current snapshot or commit that your working directory is based on. It’s typically the latest commit on the active branch.
-   Staging Area: A place where you prepare changes before committing them. Think of it as a holding area where you decide what will go into your next commit.
-   Index: Another name for the staging area.
-   Checkout: The process of moving between different branches or commits in a repository. You are switching your working directory to match a particular branch or commit.
-   Conflict: Occurs when Git is unable to automatically resolve differences between two commits (such as during a merge) because the same line of code was changed differently in both branches.
-   Cherry-pick: Selectively applying changes from one commit in another branch without merging the entire branch.
