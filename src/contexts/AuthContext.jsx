import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [adminRecord, setAdminRecord] = useState(null)
    const [selectedCampusId, setSelectedCampusId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchAdminRecord(session.user.id)
            else setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchAdminRecord(session.user.id)
            else {
                setAdminRecord(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchAdminRecord = async (userId) => {
        console.log('--- Auth Debug ---')
        console.log('Fetching admin record for UID:', userId)

        const timeout = setTimeout(() => {
            console.warn('Admin record fetch timed out after 5s')
            setLoading(false)
        }, 5000)

        try {
            // Try fetching with join first
            let { data, error } = await supabase
                .from('admins')
                .select(`*, campuses(name)`)
                .eq('user_id', userId)
                .maybeSingle()

            if (error) {
                console.error('Initial fetch error:', error.message)
                // Fallback: try without join in case campuses table is the issue
                console.log('Attempting fallback fetch without join...')
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('admins')
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle()

                if (fallbackError) {
                    console.error('Fallback fetch error:', fallbackError.message)
                } else {
                    data = fallbackData
                }
            }

            if (data) {
                console.log('Admin record successfully found:', data)
                setAdminRecord(data)

                // Initialize selected campus
                if (data.role === 'Super Admin') {
                    setSelectedCampusId(null) // Force selection page
                } else {
                    setSelectedCampusId(data.campus_id)
                }
            } else {
                console.warn('No admin record found in the "admins" table for this UID.')
            }
        } catch (err) {
            console.error('Unexpected auth exception:', err)
        } finally {
            clearTimeout(timeout)
            setLoading(false)
            console.log('--- End Auth Debug ---')
        }
    }

    const signOut = () => supabase.auth.signOut()

    return (
        <AuthContext.Provider value={{ user, adminRecord, selectedCampusId, setSelectedCampusId, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
