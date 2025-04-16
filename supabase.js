import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to check if a wallet has a .base.eth name
// This is a simplified function that can be used without an API key
export const checkBaseNameForWallet = async (address) => {
  try {
    // This is a simplified implementation
    // In a real implementation, you'd need access to Base Name Service API
    // For now, let's create a fallback that doesn't rely on external APIs

    // Try to use public ENS graph API
    try {
      const query = `
      {
        domains(where: {owner: "${address.toLowerCase()}", name_ends_with: ".base.eth"}) {
          name
        }
      }`;

      const response = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result?.data?.domains?.length > 0) {
        return result.data.domains[0].name;
      }
    } catch (err) {
      console.log("Graph query failed", err);
    }

    // Return null if no name found
    return null;
  } catch (error) {
    console.error('Error checking .base.eth name:', error);
    return null;
  }
};

// Function to check if username exists
export const checkUsernameExists = async (username) => {
  if (!username || username.trim() === '') {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('usernames')
      .select('username')
      .eq('username', username.trim())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking username:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Exception checking username:', err);
    return false;
  }
};

// Function to get username by wallet address
export const getUsernameByWallet = async (wallet) => {
  if (!wallet) {
    return { username: null, hasBaseName: false };
  }

  try {
    const { data, error } = await supabase
      .from('usernames')
      .select('username, has_base_name')
      .eq('wallet', wallet.toLowerCase())  // Ensure case consistency
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting username:', error);
      return { username: null, hasBaseName: false };
    }

    return {
      username: data?.username || null,
      hasBaseName: data?.has_base_name || false
    };
  } catch (err) {
    console.error('Exception getting username:', err);
    return { username: null, hasBaseName: false };
  }
};

// Function to save username
export const saveUsername = async (username, wallet, hasBaseName = false) => {
  if (!username || !wallet) {
    return { success: false, error: 'Missing username or wallet' };
  }

  try {
    // Normalize inputs
    const normalizedUsername = username.trim();
    const normalizedWallet = wallet.toLowerCase();

    // Check if wallet already has a username
    const existingData = await getUsernameByWallet(normalizedWallet);

    if (existingData.username) {
      // Update the existing username
      const { data, error } = await supabase
        .from('usernames')
        .update({
          username: normalizedUsername,
          has_base_name: hasBaseName,
          updated_at: new Date()
        })
        .eq('wallet', normalizedWallet);

      if (error) {
        console.error('Error updating username:', error);
        return { success: false, error: error.message };
      }

      return { success: true, username: normalizedUsername };
    } else {
      // Insert new username
      const { data, error } = await supabase
        .from('usernames')
        .insert([{
          username: normalizedUsername,
          wallet: normalizedWallet,
          has_base_name: hasBaseName,
          created_at: new Date()
        }]);

      if (error) {
        console.error('Error inserting username:', error);
        return { success: false, error: error.message };
      }

      return { success: true, username: normalizedUsername };
    }
  } catch (err) {
    console.error('Exception saving username:', err);
    return { success: false, error: 'Unexpected error occurred' };
  }
};