package com.tutorlink.auth.config;

import com.tutorlink.auth.entity.User;
import com.tutorlink.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

// Cette classe dit à Spring Security comment charger
// un utilisateur depuis la base de données
// Spring Security en a besoin pour le filtre JWT
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Spring Security appelle cette méthode avec l'email (username)
    // extrait du token JWT pour charger l'utilisateur complet
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Chercher l'utilisateur par email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Utilisateur non trouvé : " + email
                ));

        // Convertir notre entité User en UserDetails Spring Security
        // Spring Security utilise UserDetails pour gérer l'authentification
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}