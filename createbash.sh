#!/bin/bash
# Exit on any error
set -e

# Function to set user picture
set_user_picture() {
    local username="$1"
    
    # Default iMac profile picture path
    local default_picture="/Library/User Pictures/Nature/Earth.heic"
    
    # Set the user picture using multiple methods for compatibility
    sudo dscl . create /Users/"$username" Picture "$default_picture"
    sudo dscl . -delete /Users/"$username" JPEGPhoto
    sudo dscl . -delete /Users/"$username" Picture
    sudo dscl . -create /Users/"$username" Picture "$default_picture"
    
    # Force picture update
    sudo dscl . delete /Users/"$username" JPEGPhoto
    sudo dscl . create /Users/"$username" Picture "$default_picture"
}

# Function to create a user with full permissions
create_admin_user() {
    local username="$1"
    local realname="$2"
    local userid="$3"
    local password="$4"
    
    # Check if user already exists
    if dscl . -read /Users/"$username" 2>/dev/null; then
        echo "User $username already exists. Skipping creation."
        return
    fi
    
    # Create user account
    sudo dscl . -create /Users/"$username"
    sudo dscl . -create /Users/"$username" UserShell /bin/bash
    sudo dscl . -create /Users/"$username" RealName "$realname"
    sudo dscl . -create /Users/"$username" UniqueID "$userid"
    sudo dscl . -create /Users/"$username" PrimaryGroupID 20
    sudo dscl . -create /Users/"$username" NFSHomeDirectory /Users/"$username"
    
    # Set user password
    if ! sudo sysadminctl -addUser "$username" -password "$password"; then
        echo "Failed to set password for user $username. Please check password policy and try again."
        exit 1
    fi
    
    # Create home directory
    sudo createhomedir -c -u "$username"
    
    # Add to admin, staff, and wheel groups for full system permissions
    sudo dseditgroup -o edit -a "$username" -t user admin
    sudo dseditgroup -o edit -a "$username" -t user staff
    sudo dseditgroup -o edit -a "$username" -t user wheel
    
    # Set user picture
    set_user_picture "$username"
    
    echo "User $username created successfully with full permissions and default picture."
}

# Main script
echo "Starting user creation process..."

# Create IT Helpdesk user
create_admin_user "ITHelpdesk" "IT Helpdesk" "550" "MOEHelpdesk123@"

# Create MOEINTUNE user
create_admin_user "MOEINTUNE" "MOEINTUNE" "551" "MOEMACP@ssw0rd1"

# Verify group memberships
echo "Verifying group memberships for full permissions..."
sudo dseditgroup -o checkmember -m ITHelpdesk admin
sudo dseditgroup -o checkmember -m ITHelpdesk staff
sudo dseditgroup -o checkmember -m ITHelpdesk wheel
sudo dseditgroup -o checkmember -m MOEINTUNE admin
sudo dseditgroup -o checkmember -m MOEINTUNE staff
sudo dseditgroup -o checkmember -m MOEINTUNE wheel

# Verify pictures were set
echo "Verifying user pictures..."
for user in "ITHelpdesk" "MOEINTUNE"; do
    if sudo dscl . -read /Users/"$user" Picture >/dev/null 2>&1; then
        echo "Picture set successfully for $user"
    else
        echo "Warning: Picture may not have been set properly for $user"
    fi
done

echo "Script completed successfully."
exit 0
